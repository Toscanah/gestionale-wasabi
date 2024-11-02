import { Row } from "react-thermal-printer";
import { ProductInOrderType } from "../../types/ProductInOrderType";
import { OrderType } from "../../types/OrderType";
import formatAmount from "../../util/functions/formatAmount";
import TotalSection from "./TotalSection";
import { Option } from "../../types/Option";
import aggregateProducts from "../../util/functions/aggregateProducts";
import applyDiscount from "../../util/functions/applyDiscount";

const MAX_CHAR_PER_LINE = 23;
const LEFT_TO_CENTER_PADDING = 5;

const formatOptions = (options: Option[]) =>
  options
    .map(({ option }) => option.option_name.charAt(0).toUpperCase() + option.option_name.slice(1))
    .join(", ");

const formatLeftText = (text: string) => {
  const truncatedText = text.length > MAX_CHAR_PER_LINE ? text.slice(0, MAX_CHAR_PER_LINE) : text;
  return truncatedText.padEnd(MAX_CHAR_PER_LINE + LEFT_TO_CENTER_PADDING, " ");
};

const calculateDiscountAmount = (products: ProductInOrderType[], discount: number) => {
  const total = products.reduce((acc, product) => acc + product.total, 0);
  return total - applyDiscount(total, discount);
};

export default function ProductsListSection(
  products: ProductInOrderType[],
  orderType: OrderType,
  discount: number = 0,
  recipient: "kitchen" | "customer" = "customer",
  putTotal: boolean = true
) {
  const aggregatedProducts = aggregateProducts(
    products.filter((product) => product.id !== -1),
    orderType
  );

  return (
    <>
      {recipient == "customer" && (
        <Row key="header" left={formatLeftText("Prodotto") + "P.U."} right="Tot €"/>
      )}

      {aggregatedProducts.map((product, index) => {
        const { code, desc, home_price } = product.product;
        const optionsString =
          product.options.length > 0 ? `(${formatOptions(product.options)})` : "";

        const leftText = `${code.toUpperCase()} ${desc} ${optionsString}`;

        return (
          <Row
            key={`${product.product.code}-${index}`}
            left={
              recipient === "customer"
                ? formatLeftText(leftText) + `${product.quantity}x${formatAmount(home_price)}`
                : code
            }
            center={recipient === "kitchen" ? `${desc} ${optionsString}` : undefined}
            right={recipient === "customer" ? formatAmount(product.total) : `${product.quantity}`}
          />
        );
      })}

      {discount > 0 && recipient === "customer" && (
        <Row
          left={`Sconto ${discount}%`}
          right={`- ${formatAmount(calculateDiscountAmount(aggregatedProducts, discount))} €`}
        />
      )}

      {putTotal && TotalSection(products)}
    </>
  );
}
