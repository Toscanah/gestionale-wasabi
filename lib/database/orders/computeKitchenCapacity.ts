/**
 * Calculate kitchen capacity per 30-minute slot using delay rate analysis
 *
 * This function analyzes DINNER orders (18:30 - 21:30) to determine
 * the theoretical max capacity based on when discounts start appearing.
 *
 * Algorithm:
 * 1. Group orders into per-date 30-minute buckets (e.g., 2026-01-15 @ 18:30)
 * 2. For each individual date+slot instance: count orders and delay rate
 * 3. Analyze across all instances to find capacity thresholds
 * 4. Safe Capacity: 90th percentile of slots where delayRate < 15% AND the next
 *    slot didn't collapse (fixes "culprit vs victim" paradox where heavy load
 *    causes delays in the following slot, not itself)
 * 5. Collapse Point: average orders in slots with >40% delay AND rolling 60-min
 *    load > 15 (filters out noise from slow nights with coincidental delays)
 *
 * Theory: Manual discounts indicate service delays/issues, revealing capacity limits
 *
 * DINNER shift: 3 hours (18:30-21:30) = 6 slots of 30 minutes
 */

import { OrderStatus } from "@/prisma/generated/client/enums";
import { startOfDay, getHours, getMinutes, format, getDay } from "date-fns";
import prisma from "../prisma";

const DINNER_START_HOUR = 18;
const DINNER_START_MINUTE = 30;
const DINNER_END_HOUR = 21;
const DINNER_END_MINUTE = 30;
const SAFE_DELAY_THRESHOLD = 0.15; // 15% delay rate
const COLLAPSE_DELAY_THRESHOLD = 0.40; // 40% delay rate

/** A single 30-min slot on a specific date */
interface SlotInstance {
  date: string;       // e.g., "2026-01-15"
  slotTime: string;   // e.g., "19:00"
  totalOrders: number;
  ordersWithDiscount: number;
  delayRate: number;   // 0-1
}

/** Aggregated stats for a time-of-day slot across all dates */
interface TimeSlotSummary {
  slotTime: string;
  avgOrders: number;
  avgDelayRate: number;
  instances: number;
}

interface CapacityAnalysis {
  safeCapacity: number;
  collapsePoint: number | null;
  averageOrdersPerSlot: number;
  slotSummaries: TimeSlotSummary[];
  slotInstances: SlotInstance[];
  metadata: {
    dinnerPeriod: string;
    slotDuration: string;
    totalDatesAnalyzed: number;
    totalInstancesAnalyzed: number;
    totalOrdersAnalyzed: number;
    excludedDays: string[];
    safeThreshold: string;
    collapseThreshold: string;
  };
}

function getTimeSlot(date: Date): string {
  const hours = getHours(date);
  const minutes = getMinutes(date);

  // Round down to nearest 30-minute slot
  const slotMinutes = minutes < 30 ? 0 : 30;

  return `${hours.toString().padStart(2, '0')}:${slotMinutes.toString().padStart(2, '0')}`;
}

function isDinnerTime(date: Date): boolean {
  const hours = getHours(date);
  const minutes = getMinutes(date);
  const timeInMinutes = hours * 60 + minutes;

  const dinnerStart = DINNER_START_HOUR * 60 + DINNER_START_MINUTE;
  const dinnerEnd = DINNER_END_HOUR * 60 + DINNER_END_MINUTE;

  return timeInMinutes >= dinnerStart && timeInMinutes <= dinnerEnd;
}

export default async function computeKitchenCapacity(): Promise<CapacityAnalysis> {
  // Only analyze data from February 1st, 2026 onwards
  const cutoffDate = new Date('2026-02-01T00:00:00');

  const orders = await prisma.order.findMany({
    where: {
      status: { in: [OrderStatus.ACTIVE, OrderStatus.PAID] },
      suborder_of: null,
      // created_at: { gte: cutoffDate },
    },
    select: {
      id: true,
      created_at: true,
      discount: true,
    },
    orderBy: { created_at: 'asc' },
  });

  // Filter for dinner time (18:30 - 21:30) and exclude Mondays
  const dinnerOrders = orders.filter(order => {
    if (!isDinnerTime(order.created_at)) return false;
    return getDay(order.created_at) !== 1;
  });

  // Group orders by DATE + TIME SLOT (the key fix)
  const instanceMap = new Map<string, { total: number; discounted: number }>();
  const allDates = new Set<string>();

  dinnerOrders.forEach(order => {
    const date = format(startOfDay(order.created_at), 'yyyy-MM-dd');
    const slot = getTimeSlot(order.created_at);
    const key = `${date}|${slot}`;

    allDates.add(date);

    const existing = instanceMap.get(key);
    if (existing) {
      existing.total++;
      if (order.discount > 0) existing.discounted++;
    } else {
      instanceMap.set(key, { total: 1, discounted: order.discount > 0 ? 1 : 0 });
    }
  });

  // Build per-date-slot instances
  const slotInstances: SlotInstance[] = Array.from(instanceMap.entries()).map(
    ([key, { total, discounted }]) => {
      const [date, slotTime] = key.split('|');
      return {
        date,
        slotTime,
        totalOrders: total,
        ordersWithDiscount: discounted,
        delayRate: total > 0 ? discounted / total : 0,
      };
    }
  );

  slotInstances.sort((a, b) => a.date.localeCompare(b.date) || a.slotTime.localeCompare(b.slotTime));

  // Aggregate summaries per time-of-day slot (average across dates)
  const summaryMap = new Map<string, { totalOrders: number[]; delayRates: number[] }>();

  slotInstances.forEach(inst => {
    if (!summaryMap.has(inst.slotTime)) {
      summaryMap.set(inst.slotTime, { totalOrders: [], delayRates: [] });
    }
    const s = summaryMap.get(inst.slotTime)!;
    s.totalOrders.push(inst.totalOrders);
    s.delayRates.push(inst.delayRate);
  });

  const slotSummaries: TimeSlotSummary[] = Array.from(summaryMap.entries())
    .map(([slotTime, { totalOrders, delayRates }]) => ({
      slotTime,
      avgOrders: Math.round((totalOrders.reduce((a, b) => a + b, 0) / totalOrders.length) * 100) / 100,
      avgDelayRate: Math.round((delayRates.reduce((a, b) => a + b, 0) / delayRates.length) * 100) / 100,
      instances: totalOrders.length,
    }))
    .sort((a, b) => a.slotTime.localeCompare(b.slotTime));

  // --- NEW LOGIC: FIXING THE "VICTIM VS CULPRIT" PARADOX ---

  // 1. Stable Safe Capacity: A slot is only safe if it has < 15% delay AND 
  // it didn't cause the NEXT slot to collapse.
  const validSafeInstances = slotInstances.filter((inst, index) => {
    // Must be safe itself
    if (inst.delayRate >= SAFE_DELAY_THRESHOLD) return false;
    
    // Check the NEXT slot on the same day. If it collapsed, THIS slot was the culprit.
    const nextInst = slotInstances[index + 1];
    if (nextInst && nextInst.date === inst.date) {
       if (nextInst.delayRate > COLLAPSE_DELAY_THRESHOLD) {
           return false; // Reject: this high volume caused a delayed wave
       }
    }
    return true;
  });

  // Take the 90th percentile of TRULY safe slots to find the realistic max capacity
  const safeVolumes = validSafeInstances.map((i) => i.totalOrders).sort((a, b) => a - b);
  const safeCapacity = safeVolumes.length > 0 
    ? safeVolumes[Math.floor(safeVolumes.length * 0.9)] // 90th percentile (removes extreme lucky outliers)
    : 0;

  // 2. Collapse Point: We look at the actual load that broke the kitchen.
  // We use a rolling window (current + previous slot) because delays are caused by BACKLOG.
  const collapseInstances = slotInstances.filter((inst, index) => {
    if (inst.delayRate <= COLLAPSE_DELAY_THRESHOLD) return false;
    
    // Ignore slow nights where a 1-order delay throws a false positive
    const rollingLoad = inst.totalOrders + (
      index > 0 && slotInstances[index - 1].date === inst.date 
        ? slotInstances[index - 1].totalOrders 
        : 0
    );
    
    // A true collapse happens when the rolling 60-min load is high
    return rollingLoad > 15; // Minimum logical threshold to consider it a volume issue
  });

const collapsePoint = collapseInstances.length > 0
    ? Math.round(
        // Facciamo la media del "Rolling Load / 2" (il carico medio per slot nell'ultima ora di fuoco)
        // Questo trova la vera "pressione" che ha fatto saltare il tappo
        collapseInstances.reduce((sum, inst, index) => {
          const prevOrders = index > 0 && slotInstances[index - 1].date === inst.date 
            ? slotInstances[index - 1].totalOrders 
            : inst.totalOrders; // se non c'è precedente, raddoppiamo quello attuale per stima
          return sum + ((inst.totalOrders + prevOrders) / 2);
        }, 0) / collapseInstances.length
      )
    : null;

  // Average orders per slot instance
  const totalAllOrders = slotInstances.reduce((sum, inst) => sum + inst.totalOrders, 0);
  const averageOrdersPerSlot = slotInstances.length > 0
    ? Math.round((totalAllOrders / slotInstances.length) * 100) / 100
    : 0;

  return {
    safeCapacity,
    collapsePoint,
    averageOrdersPerSlot,
    slotSummaries,
    slotInstances,
    metadata: {
      dinnerPeriod: `${DINNER_START_HOUR}:${DINNER_START_MINUTE.toString().padStart(2, '0')} - ${DINNER_END_HOUR}:${DINNER_END_MINUTE.toString().padStart(2, '0')}`,
      slotDuration: '30 minutes',
      totalDatesAnalyzed: allDates.size,
      totalInstancesAnalyzed: slotInstances.length,
      totalOrdersAnalyzed: dinnerOrders.length,
      excludedDays: ['Monday'],
      safeThreshold: `${(SAFE_DELAY_THRESHOLD * 100).toFixed(0)}% delay rate`,
      collapseThreshold: `${(COLLAPSE_DELAY_THRESHOLD * 100).toFixed(0)}% delay rate`,
    },
  };
}
