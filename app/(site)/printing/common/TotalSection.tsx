import { Br, Text } from "react-thermal-printer";
import { ProductInOrder } from "@/app/(site)/models";
import applyDiscount from "../../functions/order-management/applyDiscount";
import formatAmount from "../../functions/formatting-parsing/formatAmount";
import getReceiptSize from "../../functions/formatting-parsing/printing/getReceiptSize";

export default function TotalSection(
  products: ProductInOrder[],
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
