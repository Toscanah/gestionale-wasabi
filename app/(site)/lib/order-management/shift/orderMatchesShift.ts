import { WorkingShift } from "@prisma/client";
import { getEffectiveOrderShift } from "./getOrderShift";
import { ShiftEvaluableOrder } from "@/app/(site)/shared/types/ShiftEvaluableOrder";
import { ShiftFilter } from "@/app/(site)/shared/types/ShiftFilter";

export default function orderMatchesShift(
  order: ShiftEvaluableOrder,
  shiftFilter: ShiftFilter
): boolean {
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
