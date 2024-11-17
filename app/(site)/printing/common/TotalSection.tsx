import { Br, Text } from "react-thermal-printer";
import { ProductInOrderType } from "../../types/ProductInOrderType";
import applyDiscount from "../../util/functions/applyDiscount";
import formatAmount from "../../util/functions/formatAmount";
import getReceiptSize from "../../util/functions/getReceiptSize";

export default function TotalSection(
  products: ProductInOrderType[],
  discount: number = 0,
  bold: boolean = false
) {
  return (
    <>
      <Br />

      <Text size={getReceiptSize(2, 2)} align="center" bold={bold}>
        {`TOTALE: ${formatAmount(
          applyDiscount(
            products.reduce((acc, product) => acc + product.total, 0),
            discount
          )
        )} €`}
      </Text>
    </>
  );
}
