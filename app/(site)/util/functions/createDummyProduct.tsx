import { ProductInOrder } from "@/app/(site)/models";

export default function createDummyProduct(): ProductInOrder {
  return {
    rice_quantity: 0,
    state: "IN_ORDER",
    printed_amount: -1,
    product: {
      kitchen: "NONE",
      active: true,
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
    total: 0,
    id: -1,
    is_paid_fully: false,
    paid_quantity: 0,
  };
}
