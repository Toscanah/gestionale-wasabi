import { ProductInOrder } from "@/app/(site)/lib/shared";
import { KitchenType, ProductInOrderStatus } from "@prisma/client";

export default function generateDummyProduct(): ProductInOrder {
  return {
    created_at: new Date(Date.now() + 60 * 1000),
    variation: "",
    status: ProductInOrderStatus.IN_ORDER,
    printed_amount: -1,
    frozen_price: 0,
    product: {
      kitchen: KitchenType.NONE,
      active: true,
      salads: 0,
      soups: 0,
      rices: 0,
      category: {
        active: false,
        id: -1,
        category: "nothing",
        options: [],
      },
      id: -1,
      code: "",
      desc: "",
      home_price: 0,
      site_price: 0,
      category_id: -1,
      rice: 0,
    },
    options: [],
    product_id: -1,
    order_id: -1,
    quantity: 0,
    id: -1,
    paid_quantity: 0,
  };
}
