import {
  CustomerOrigin,
  OrderStatus,
  OrderType,
  PlannedPayment,
  WorkingShift,
} from "@/prisma/generated/client/enums";
import { DEFAULT_WHEN_VALUE, OrderByType } from "@/app/(site)/lib/shared";

export default function generateEmptyOrder(orderType: OrderType): OrderByType {
  const base = {
    discount: 0,
    engagements: [],
    shift: WorkingShift.UNSPECIFIED,
    is_receipt_printed: false,
    status: OrderStatus.ACTIVE,
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
    promotion_usages: [],
  };

  switch (orderType) {
    case OrderType.TABLE:
      return {
        ...base,
        type: OrderType.TABLE,
        table_order: { id: -1, table: "", res_name: "", people: 0 },
      };
    case OrderType.HOME:
      return {
        ...base,
        type: OrderType.HOME,
        home_order: {
          id: -1,
          address_id: -1,
          customer_id: -1,
          when: DEFAULT_WHEN_VALUE,
          prepaid: false,
          planned_payment: PlannedPayment.UNKNOWN,
          contact_phone: "",
          messages: [],
          customer: {
            active: false,
            id: -1,
            phone_id: -1,
            engagements: [],
            origin: CustomerOrigin.UNKNOWN,
            phone: {
              id: -1,
              phone: "",
            },
          },
          address: {
            active: false,
            id: -1,
            civic: "",
            street: "",
            customer_id: -1,
            doorbell: "",
            temporary: false,
          },
        },
      };
    case OrderType.PICKUP:
      return {
        ...base,
        type: OrderType.PICKUP,
        pickup_order: {
          id: -1,
          name: "",
          when: DEFAULT_WHEN_VALUE,
          prepaid: false,
          planned_payment: PlannedPayment.UNKNOWN,
          customer: null,
        },
      };
  }
}
