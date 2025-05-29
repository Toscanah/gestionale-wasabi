import { Br, Text } from "react-thermal-printer";
import { ProductInOrder } from "@shared";
import getDiscountedTotal from "../../lib/order-management/getDiscountedTotal";
import roundToTwo from "../../lib/formatting-parsing/roundToTwo";
import getReceiptSize from "../../lib/formatting-parsing/printing/getReceiptSize";
import { OrderType } from "@prisma/client";
import { getProductPrice } from "../../lib/product-management/getProductPrice";
import { getOrderTotal } from "../../lib/order-management/getOrderTotal";

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
        {`TOTALE: ${getOrderTotal({
          order: { products, discount, type: orderType },
          applyDiscount: true,
          round: true,
        })} €`}
      </Text>
    </>
  );
}
