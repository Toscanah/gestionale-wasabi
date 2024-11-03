import { Option } from "@/app/(site)/types/Option";
import { ProductInOrderType } from "@/app/(site)/types/ProductInOrderType";
import applyDiscount from "@/app/(site)/util/functions/applyDiscount";
import formatAmount from "@/app/(site)/util/functions/formatAmount";
import formatReceiptText from "@/app/(site)/util/functions/formatReceiptText";
import { Row, Text } from "react-thermal-printer";
import TotalSection from "../TotalSection";

const MAX_CHAR_PER_LINE = 23;
const LEFT_PADDING = 5;

const calculateDiscountAmount = (products: ProductInOrderType[], discount: number) => {
  const total = products.reduce((acc, product) => acc + product.total, 0);
  return total - applyDiscount(total, discount);
};

// TODO: generalizzare questa in giro
const formatOptions = (options: Option[]) =>
  options
    .map(({ option }) => option.option_name.charAt(0).toUpperCase() + option.option_name.slice(1))
    .join(", ");

interface CustomerProductsProps {
  discount: number;
  aggregatedProducts: ProductInOrderType[];
}

export default function CustomerProducts({ discount, aggregatedProducts }: CustomerProductsProps) {
  return (
    <>
      <Row
        key="header"
        left={formatReceiptText("Prodotto", MAX_CHAR_PER_LINE, LEFT_PADDING) + "P.Unit."}
        right="Tot €"
      />

      {aggregatedProducts.map((product, index) => {
        const { code, desc, home_price } = product.product;
        const optionsString =
          product.options.length > 0 ? `(${formatOptions(product.options)})` : "";

        const leftText = `${code.toUpperCase()} ${desc} ${optionsString}`;

        return (
          <Row
            key={`${product.product.code}-${index}`}
            left={
              <Text bold>
                {formatReceiptText(leftText, MAX_CHAR_PER_LINE, LEFT_PADDING) +
                  `${product.quantity} x ${formatAmount(home_price)}`}
              </Text>
            }
            right={<Text bold>{formatAmount(product.total)}</Text>}
          />
        );
      })}

      {discount > 0 && (
        <Row
          left={<Text>Sconto {discount}%</Text>}
          right={
            <Text>- ${formatAmount(calculateDiscountAmount(aggregatedProducts, discount))} €</Text>
          }
        />
      )}

      {TotalSection(aggregatedProducts, discount)}
    </>
  );
}
