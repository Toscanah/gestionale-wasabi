import { ProductInOrder } from "@/app/(site)/models";
import applyDiscount from "@/app/(site)/util/functions/applyDiscount";
import formatAmount from "@/app/(site)/util/functions/formatAmount";
import formatReceiptText from "@/app/(site)/util/functions/formatReceiptText";
import { Br, Row, Text } from "react-thermal-printer";
import TotalSection from "../TotalSection";
import formatOptionsString from "@/app/(site)/util/functions/formatOptionsString";
import { Fragment } from "react";
import { getProductPrice } from "@/app/(site)/util/functions/getProductPrice";
import { OrderType } from "@prisma/client";

const MAX_CHAR_PER_LINE = 23;
const LEFT_PADDING = 5;

const calculateDiscountAmount = (products: ProductInOrder[], discount: number) => {
  const total = products.reduce((acc, product) => acc + product.total, 0);
  return total - applyDiscount(total, discount);
};

interface CustomerProductsProps {
  discount: number;
  aggregatedProducts: ProductInOrder[];
  orderType: OrderType;
}

export default function CustomerProducts({
  discount,
  aggregatedProducts,
  orderType,
}: CustomerProductsProps) {
  const ProductLine = ({ product }: { product: ProductInOrder }) => {
    // Calculate dynamic lengths for quantity x price and total
    const quantityLength = String(product.quantity).length; // 1 or 2 chars
    const priceLength = getProductPrice(product, orderType).toFixed(2).length; // Always 5 chars (e.g., "10.45")
    const totalLength = product.total.toFixed(2).length; // 1–6 chars

    const quantityPriceLength = quantityLength + 3 + priceLength; // Quantity + "x" + Price
    const padding = 4;
    // Remaining space for description
    const descriptionMax =
      48 - (4 + padding + quantityPriceLength + padding + totalLength + padding);

    return (
      <Fragment>
        <Text inline>{formatReceiptText(product.product.code.toUpperCase(), 4, padding)}</Text>

        <Text inline>{formatReceiptText(product.product.desc, descriptionMax, padding)}</Text>

        <Text inline>
          {formatReceiptText(
            product.quantity + " x " + getProductPrice(product, orderType).toFixed(2),
            quantityPriceLength,
            padding
          )}
        </Text>

        <Text>{formatReceiptText(product.total.toFixed(2), totalLength)}</Text>
      </Fragment>
    );
  };

  return (
    <>
      <Text>
        {formatReceiptText("Prodotto", MAX_CHAR_PER_LINE, LEFT_PADDING)}
        {formatReceiptText("P.Unit.", 7, 8)}
        Tot €
      </Text>

      <Br />

      {aggregatedProducts.map((product, index) => (
        <Fragment key={product + "-" + index}>
          {ProductLine({ product })}

          {product.options.length > 0 && <Text> - {formatOptionsString(15, product.options)}</Text>}
        </Fragment>
      ))}

      {discount > 0 && (
        <Row
          left={<Text>Sconto {discount}%</Text>}
          right={
            <Text>- {formatAmount(calculateDiscountAmount(aggregatedProducts, discount))}</Text>
          }
        />
      )}

      {TotalSection(aggregatedProducts, discount)}
      <Br />
      <Br />
    </>
  );
}
