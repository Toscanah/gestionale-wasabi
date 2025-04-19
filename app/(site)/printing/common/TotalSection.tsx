import { Br, Text } from "react-thermal-printer";
import { ProductInOrder } from "@shared"
;
import applyDiscount from "../../lib/order-management/applyDiscount";
import roundToTwo from "../../lib/formatting-parsing/roundToTwo";
import getReceiptSize from "../../lib/formatting-parsing/printing/getReceiptSize";

export default function TotalSection(
  products: ProductInOrder[],
  discount: number = 0,
  bold: boolean = false
) {
  const bigSize = getReceiptSize(2, 2);

  return (
    <>
      <Br />

      <Text size={bigSize} align="center" bold={bold}>
        {`TOTALE: ${roundToTwo(
          applyDiscount(
            products.reduce((acc, product) => acc + product.total, 0),
            discount
          )
        )} €`}
      </Text>
    </>
  );
}
