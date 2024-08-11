import { ProductInOrderType } from "../../types/ProductInOrderType";

export default function createDummyProduct(): ProductInOrderType {
  return {
    product: {
      category: {
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
  };
}
