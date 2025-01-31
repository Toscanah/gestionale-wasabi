import { Br, Text } from "react-thermal-printer";
import { ProductInOrder } from "@/app/(site)/models";
import applyDiscount from "../../functions/order-management/applyDiscount";
import roundToTwo from "../../functions/formatting-parsing/roundToTwo";
import getReceiptSize from "../../functions/formatting-parsing/printing/getReceiptSize";

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
