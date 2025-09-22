import { WorkingShift } from "@prisma/client";
import { ShiftFilterValue } from "../../../shared/enums/Shift";
import { getEffectiveOrderShift } from "./getEffectiveOrderShift";
import { ShiftEvaluableOrder } from "../../../shared";

export default function orderMatchesShift(
  order: ShiftEvaluableOrder,
  shiftFilter: ShiftFilterValue
): boolean {
  if (shiftFilter === ShiftFilterValue.ALL) return true;

  const { effectiveShift } = getEffectiveOrderShift(order);

  if (shiftFilter === ShiftFilterValue.LUNCH) {
    return effectiveShift === WorkingShift.LUNCH;
  }

  if (shiftFilter === ShiftFilterValue.DINNER) {
    return effectiveShift === WorkingShift.DINNER;
  }

  return true;
}
