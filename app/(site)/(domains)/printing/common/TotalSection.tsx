import { Br, Text } from "react-thermal-printer";
import { ProductInOrder } from "@/app/(site)/lib/shared";
import roundToTwo from "../../../lib/formatting-parsing/roundToTwo";
import getReceiptSize from "../../../lib/formatting-parsing/printing/getReceiptSize";
import { OrderType } from "@prisma/client";
import { getOrderTotal } from "../../../lib/services/order-management/getOrderTotal";

export default function TotalSection(
  products: ProductInOrder[],
  discount: number = 0,
  bold: boolean = false,
  orderType: OrderType
) {
  const bigSize = getReceiptSize(2, 2);

  return (
    <>
      <Br />

      <Text size={bigSize} align="center" bold={bold}>
        {`TOTALE: ${roundToTwo(
          getOrderTotal({
            order: { products, discount, type: orderType },
            applyDiscount: true,
          })
        )} €`}
      </Text>
    </>
  );
}
