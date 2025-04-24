import { ProductInOrder } from "../../shared";

export default function filterDeletedProducts(products: ProductInOrder[]) {
  return products.filter((product) => product.state == "IN_ORDER");
}
