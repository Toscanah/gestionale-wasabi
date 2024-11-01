import { Br, Row, } from "react-thermal-printer";
import { ProductInOrderType } from "../../types/ProductInOrderType";
import { OrderType } from "../../types/OrderType";
import formatAmount from "../../util/functions/formatAmount";
import total from "./total";
import { Option } from "../../types/Option";
import aggregateProducts from "../../util/functions/aggregateProducts";
import applyDiscount from "../../util/functions/applyDiscount";

const formatOptions = (options: Option[]) =>
  options
    .map(({ option }) => option.option_name.charAt(0).toUpperCase() + option.option_name.slice(1))
    .join(", ");

export default function products(
  products: ProductInOrderType[],
  discount: number = 0,
  recipient: "kitchen" | "customer" = "customer",
  putTotal: boolean = true
) {
  return (
    <>
      {aggregateProducts(products.filter((product) => product.id !== -1)).map((product, index) => {
        const { code, desc, home_price } = product.product;
        const optionsString =
          product.options.length > 0 ? `(${formatOptions(product.options)})` : "";

        return recipient === "customer" ? (
          <Row
            
            key={index}
            left={`${code} ${desc} ${optionsString}`}
            center={`${product.quantity} * ${formatAmount(home_price)} €`}
            right={`${formatAmount(product.total)} €`}
          />
        ) : (
          <Row
            
            key={index}
            left={code}
            center={`${desc} ${optionsString}`}
            right={`${product.quantity}`}
          />
        );
      })}

      {discount > 0 && recipient === "customer" && (
        <Row
          left={"Sconto " + discount + "%"}
          right={`- ${formatAmount(
            products.reduce((acc, product) => acc + product.total, 0) -
              applyDiscount(
                products.reduce((acc, product) => acc + product.total, 0),
                discount
              )
          )} €`}
        />
      )}

      <Br />
      {putTotal && total(products)}
    </>
  );
}
