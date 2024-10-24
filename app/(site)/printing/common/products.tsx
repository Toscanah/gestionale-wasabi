import { Br, Cut, Line, Row, Text } from "react-thermal-printer";
import { ProductInOrderType } from "../../types/ProductInOrderType";
import { OrderType } from "../../types/OrderType";
import formatAmount from "../../util/functions/formatAmount";
import total from "./total";
import { Option } from "../../types/Option";

const formatOptions = (options: Option[]) =>
  options
    .map(({ option }) => option.option_name.charAt(0).toUpperCase() + option.option_name.slice(1))
    .join(", ");

export default function products(
  products: ProductInOrderType[],
  recipient: "kitchen" | "customer" = "customer"
) {
  return (
    <>
      {products.map((product, index) => {
        const { code, desc, home_price } = product.product;
        const optionsString = `(${formatOptions(product.options)})`;

        return recipient === "customer" ? (
          <Row
            gap={10}
            key={index}
            left={`${code} ${desc} ${optionsString}`}
            center={`${product.quantity} * ${formatAmount(home_price)} €`}
            right={`${formatAmount(product.total)} €`}
          />
        ) : (
          <Row
            gap={10}
            key={index}
            left={code}
            center={`${desc} ${optionsString}`}
            right={`${product.quantity}`}
          />
        );
      })}
      
      <Br />
      {total(products)}
    </>
  );
}
