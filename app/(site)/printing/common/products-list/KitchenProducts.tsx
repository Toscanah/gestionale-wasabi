import { ProductInOrderType } from "@/app/(site)/types/ProductInOrderType";
import { Fragment } from "react";
import { Row, Text } from "react-thermal-printer";

export default function KitchenProducts({
  aggregatedProducts,
}: {
  aggregatedProducts: ProductInOrderType[];
}) {
  const groupedProducts: { [key: string]: ProductInOrderType[] } = {};
  aggregatedProducts.forEach((product) => {
    const optionsKey = product.options.map(({ option }) => option.option_name).join(", ");
    if (!groupedProducts[optionsKey]) {
      groupedProducts[optionsKey] = [];
    }
    groupedProducts[optionsKey].push(product);
  });

  return (
    <>
      {Object.entries(groupedProducts).map(([optionsKey, products], idx) => (
        <Fragment key={idx}>
          {products.map((product, index) => (
            <Row
              key={`${product.product.code}-${index}`}
              left={
                <Text bold>
                  {index % 2 === 0
                    ? `${product.product.code.toUpperCase()} ${product.product.desc} | ${
                        index === 0 ? optionsKey : ""
                      }`
                    : `|`}
                </Text>
              }
              right={<Text bold>{product.quantity}</Text>}
            />
          ))}
        </Fragment>
      ))}
    </>
  );
}
