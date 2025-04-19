import { OrderType, WorkingShift } from "@prisma/client";
import { AnyOrder } from "../models/_index";

export type ShiftEvaluableOrder = Partial<AnyOrder> & {
  type: OrderType;
  created_at: string | Date;
  shift?: WorkingShift;
  home_order?: { when?: string } | null;
  pickup_order?: { when?: string } | null;
};
