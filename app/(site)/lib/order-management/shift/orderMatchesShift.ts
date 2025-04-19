import { WorkingShift } from "@prisma/client";
import { ShiftFilter } from "@/app/(site)/components/filters/shift/ShiftFilterSelector";
import { getEffectiveOrderShift } from "./getOrderShift";
import { ShiftEvaluableOrder } from "@/app/(site)/shared/types/ShiftEvaluableOrder";

export function orderMatchesShift(order: ShiftEvaluableOrder, shiftFilter: ShiftFilter): boolean {
  if (shiftFilter === ShiftFilter.BOTH) return true;

  const { effectiveShift } = getEffectiveOrderShift(order);

  if (shiftFilter === ShiftFilter.LUNCH) {
    return effectiveShift === WorkingShift.LUNCH;
  }

  if (shiftFilter === ShiftFilter.DINNER) {
    return effectiveShift === WorkingShift.DINNER;
  }

  return true;
}
