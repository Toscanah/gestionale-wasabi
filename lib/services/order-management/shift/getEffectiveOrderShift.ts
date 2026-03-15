import { OrderType, WorkingShift } from "@/prisma/generated/client/enums";
import { DEFAULT_WHEN_VALUE, ShiftBoundaries } from "@/lib/shared";
import timeToDecimal from "../../../shared/utils/global/time/timeToDecimal";
import { ShiftEvaluableOrder } from "../../../shared";

function normalizeWhen(when?: string): string | string {
  return when?.toLowerCase() ?? DEFAULT_WHEN_VALUE;
}

export function parseOrderTime(order: ShiftEvaluableOrder): number {
  let when: string | undefined;

  if (order.type === OrderType.HOME) {
    when = order.home_order?.when;
  } else if (order.type === OrderType.PICKUP) {
    when = order.pickup_order?.when;
  } else if (order.type === OrderType.TABLE) {
    return timeToDecimal(new Date(order.created_at));
  }

  const normalizedWhen = normalizeWhen(when);
  const date =
    normalizedWhen === DEFAULT_WHEN_VALUE
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
  forceInfer = false,
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
