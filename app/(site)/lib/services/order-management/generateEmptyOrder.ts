import { OrderState, OrderType, WorkingShift } from "@prisma/client";
import { AnyOrder } from "@/app/(site)/lib/shared";

export default function generateEmptyOrder(orderType: OrderType): AnyOrder {
  return {
    discount: 0,
    engagements: [],
    shift: WorkingShift.UNSPECIFIED,
    is_receipt_printed: false,
    state: OrderState.ACTIVE,
    suborder_of: null,
    id: -1,
    rices: 0,
    salads: 0,
    soups: 0,
    created_at: new Date(),
    updated_at: new Date(),
    products: [],
    payments: [],
    type: orderType,
    table_order: null,
    home_order: null,
    pickup_order: null,
  };
}
