import { ProductInOrderType } from "@/app/(site)/types/ProductInOrderType";
import applyDiscount from "@/app/(site)/util/functions/applyDiscount";
import formatAmount from "@/app/(site)/util/functions/formatAmount";
import formatReceiptText from "@/app/(site)/util/functions/formatReceiptText";
import { Br, Row, Text } from "react-thermal-printer";
import TotalSection from "../TotalSection";
import formatOptionsString from "@/app/(site)/util/functions/formatOptionsString";
import { Fragment } from "react";

const MAX_CHAR_PER_LINE = 23;
const LEFT_PADDING = 5;

const calculateDiscountAmount = (products: ProductInOrderType[], discount: number) => {
  const total = products.reduce((acc, product) => acc + product.total, 0);
  return total - applyDiscount(total, discount);
};

interface CustomerProductsProps {
  discount: number;
  aggregatedProducts: ProductInOrderType[];
}

export default function CustomerProducts({ discount, aggregatedProducts }: CustomerProductsProps) {
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
          <Text bold>
            {formatReceiptText(
              `${product.product.code.toUpperCase()} ${product.product.desc}`,
              MAX_CHAR_PER_LINE,
              LEFT_PADDING
            ) +
              formatReceiptText(
                `${product.quantity} x ${formatAmount(product.product.home_price)}`,
                10,
                String(product.total).length > 1 ? LEFT_PADDING : LEFT_PADDING + 1
              )}
            {formatAmount(product.total).trim()}
          </Text>

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
    </>
  );
}
