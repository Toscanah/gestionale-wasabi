import { OrderType } from "@prisma/client";
import { AnyOrder } from "@/app/(site)/models";

export default function generateEmptyOrder(orderType: OrderType): AnyOrder {
  return {
    discount: 0,
    is_receipt_printed: false,
    state: "ACTIVE",
    suborder_of: null,
    total: 0,
    id: -1,
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
