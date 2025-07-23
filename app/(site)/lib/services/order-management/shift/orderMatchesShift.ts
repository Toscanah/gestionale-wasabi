import { WorkingShift } from "@prisma/client";
import { getEffectiveOrderShift } from "./getEffectiveOrderShift";
import { ShiftEvaluableOrder } from "@/app/(site)/lib/shared/types/ShiftEvaluableOrder";
import { ShiftType } from "@/app/(site)/lib/shared/enums/Shift";

export default function orderMatchesShift(
  order: ShiftEvaluableOrder,
  shiftFilter: ShiftType
): boolean {
  if (shiftFilter === ShiftType.ALL) return true;

  const { effectiveShift } = getEffectiveOrderShift(order);

  if (shiftFilter === ShiftType.LUNCH) {
    return effectiveShift === WorkingShift.LUNCH;
  }

  if (shiftFilter === ShiftType.DINNER) {
    return effectiveShift === WorkingShift.DINNER;
  }

  return true;
}
