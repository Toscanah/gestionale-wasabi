import { Br, Text } from "react-thermal-printer";
import { AnyOrder } from "../../types/PrismaOrders";
import { ProductInOrderType } from "../../types/ProductInOrderType";
import applyDiscount from "../../util/functions/applyDiscount";
import formatAmount from "../../util/functions/formatAmount";

export default function TotalSection(products: ProductInOrderType[], discount: number = 0) {
  const total = formatAmount(
    applyDiscount(
      products.reduce((acc, product) => acc + product.total, 0),
      discount
    )
  );

  return (
    <>
      <Br />
      
      <Text size={{ width: 2, height: 2 }} align="center" inline>
        TOTALE:{" "}
      </Text>
      <Text size={{ width: 2, height: 2 }} align="center" bold>
        {total + " €"}
      </Text>
    </>
  );
}
