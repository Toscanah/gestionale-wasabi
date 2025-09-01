import { OrderType, WorkingShift } from "@prisma/client";
import { ShiftEvaluableOrder } from "@/app/(site)/lib/shared/types/shift-evaluable-order";
import { ShiftBoundaries } from "../../../shared/enums/shift";
import timeToDecimal from "../../../utils/global/time/timeToDecimal";

function normalizeWhen(when?: string): string | "immediate" {
  return when?.toLowerCase() ?? "immediate";
}

export function parseOrderTime(order: ShiftEvaluableOrder): number {
  let when: string | undefined;

  if (order.type === OrderType.HOME) {
    when = order.home_order?.when;
  } else if (order.type === OrderType.PICKUP) {
    when = order.pickup_order?.when;
  }

  const normalizedWhen = normalizeWhen(when);
  const date =
    normalizedWhen === "immediate"
      ? new Date(order.created_at)
      : new Date(`1970-01-01T${normalizedWhen}`);

  return timeToDecimal(date);
}

function inferShift(time: number): WorkingShift {
  if (time >= ShiftBoundaries.LUNCH_FROM && time <= ShiftBoundaries.LUNCH_TO) {
    return WorkingShift.LUNCH;
  }

  if (time > ShiftBoundaries.LUNCH_TO && time <= ShiftBoundaries.DINNER_TO) {
    return WorkingShift.DINNER;
  }

  return WorkingShift.UNSPECIFIED;
}

export function getEffectiveOrderShift(
  order: ShiftEvaluableOrder,
  forceInfer = false
): {
  effectiveShift: WorkingShift;
} {
  if (!forceInfer && order.shift && order.shift !== WorkingShift.UNSPECIFIED) {
    return { effectiveShift: order.shift };
  }

  const time = parseOrderTime(order);
  const effectiveShift = inferShift(time);

  return { effectiveShift };
}
