import { Text } from "react-thermal-printer";
import { AnyOrder } from "../../types/PrismaOrders";
import { ProductInOrderType } from "../../types/ProductInOrderType";
import applyDiscount from "../../util/functions/applyDiscount";

export default function total(products: ProductInOrderType[], discount: number = 0) {
  return (
    <>
      <Text size={{ width: 2, height: 2 }} align="center" inline>
        TOTALE:{" "}
      </Text>
      <Text size={{ width: 2, height: 2 }} align="center" bold>
        {applyDiscount(
          products.reduce((acc, product) => acc + product.total, 0),
          discount
        ).toFixed(2) + " €"}
      </Text>
    </>
  );
}
