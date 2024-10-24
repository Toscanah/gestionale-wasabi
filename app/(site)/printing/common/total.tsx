import { Text } from "react-thermal-printer";
import { AnyOrder } from "../../types/PrismaOrders";
import { ProductInOrderType } from "../../types/ProductInOrderType";

export default function total(products: ProductInOrderType[]) {
  return (
    <>
      <Text size={{ width: 2, height: 2 }} align="center" inline>
        TOTALE:{" "}
      </Text>
      <Text size={{ width: 2, height: 2 }} align="center" bold>
        {products.reduce((acc, product) => acc + product.quantity * product.total, 0).toFixed(2) +
          " €"}
      </Text>
    </>
  );
}
