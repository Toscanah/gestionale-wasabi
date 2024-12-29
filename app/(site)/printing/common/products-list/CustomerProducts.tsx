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

const PRODUCT_HEADER_MAX = 23;
const PRODUCT_HEADER_PADDING = 5;
const UNIT_PRICE_HEADER_MAX = 7;

const PRODUCT_CODE_LENGTH = 4;
const DESCRIPTION_LENGTH = 16;
const QUANTITY_PRICE_LENGTH = 10;
const MAX_TOTAL_LENGTH = 6;

const DEFAULT_PADDING = 4;

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
    const actualTotalLength = Math.min(formatAmount(product.total).length, MAX_TOTAL_LENGTH);
    const additionalPadding = MAX_TOTAL_LENGTH - actualTotalLength;

    return (
      <Fragment>
        <Text inline>
          {formatReceiptText(
            product.product.code.toUpperCase(),
            PRODUCT_CODE_LENGTH,
            DEFAULT_PADDING
          )}
        </Text>

        <Text inline>
          {formatReceiptText(product.product.desc, DESCRIPTION_LENGTH, DEFAULT_PADDING)}
        </Text>

        <Text inline>
          {formatReceiptText(
            product.quantity + " x " + getProductPrice(product, orderType).toFixed(2),
            QUANTITY_PRICE_LENGTH,
            DEFAULT_PADDING + additionalPadding
          )}
        </Text>

        <Text>{formatReceiptText(product.total.toFixed(2), actualTotalLength)}</Text>
      </Fragment>
    );
  };

  const maxActualTotalLength = Math.max(
    ...aggregatedProducts.map((product) =>
      Math.min(formatAmount(product.total).length, MAX_TOTAL_LENGTH)
    )
  );

  let dynamicUnitPricePadding = UNIT_PRICE_HEADER_MAX + (MAX_TOTAL_LENGTH - maxActualTotalLength);

  if (maxActualTotalLength <= 4) {
    dynamicUnitPricePadding = dynamicUnitPricePadding - 1;
  }

  return (
    <>
      <Text>
        {formatReceiptText("Prodotto", PRODUCT_HEADER_MAX, PRODUCT_HEADER_PADDING)}
        {formatReceiptText("P.Unit.", UNIT_PRICE_HEADER_MAX, dynamicUnitPricePadding)}
        Tot €
      </Text>

      <Br />

      {aggregatedProducts.map((product, index) => (
        <Fragment key={product + "-" + index}>
          {ProductLine({ product })}

          {product.options.length > 0 && <Text>- {formatOptionsString(15, product.options)}</Text>}
        </Fragment>
      ))}

      {discount > 0 && (
        <Row
          left={<Text>- {discount}%</Text>}
          right={
            <Text>- {formatAmount(calculateDiscountAmount(aggregatedProducts, discount))}</Text>
          }
        />
      )}

      {TotalSection(aggregatedProducts, discount, true)}
      <Br />
    </>
  );
}
