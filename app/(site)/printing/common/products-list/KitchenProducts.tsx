import { ProductInOrderType } from "@/app/(site)/types/ProductInOrderType";
import formatReceiptText from "@/app/(site)/util/functions/formatReceiptText";
import { Fragment } from "react";
import { Row, Text, TextSize } from "react-thermal-printer";

export default function KitchenProducts({
  aggregatedProducts,
}: {
  aggregatedProducts: ProductInOrderType[];
}) {
  const size: { width: TextSize; height: TextSize } = { width: 2, height: 2 };
  const groupedProducts: { [key: string]: ProductInOrderType[] } = {};

  aggregatedProducts.forEach((product) => {
    if (product.options.length === 0) {
      if (!groupedProducts["no_options"]) {
        groupedProducts["no_options"] = [];
      }
      groupedProducts["no_options"].push(product);
      return;
    }

    const optionsKey = product.options
      .map(({ option }) => option.option_name)
      .sort()
      .join(", ");

    if (!groupedProducts[optionsKey]) {
      groupedProducts[optionsKey] = [];
    }
    groupedProducts[optionsKey].push(product);
  });

  return (
    <>
      {groupedProducts["no_options"]?.map((product, index) => (
        <Row
          key={`no-option-${product.product.code}-${index}`}
          left={
            <Text bold>
              {formatReceiptText(
                `${product.product.code.toUpperCase()} ${product.product.desc}`,
                35,
                5
              )}
            </Text>
          }
          right={<Text bold>{product.quantity}</Text>}
        />
      ))}

      {Object.entries(groupedProducts)
        .filter(([key]) => key !== "no_options")
        .map(([optionsKey, products], idx) => (
          <Fragment key={idx}>
            {products.map((product, index) => (
              <Row
                key={`${product.product.code}-${index}`}
                left={
                  <Text bold size={size}>
                    {formatReceiptText(
                      `${product.product.code.toUpperCase()} ${product.product.desc}`,
                      15,
                      0
                    )}
                    {"> "}
                    {formatReceiptText(
                      index === Math.floor(products.length / 2) - 1 ? optionsKey : "",
                      15,
                      0
                    )}
                  </Text>
                }
                right={
                  <Text bold size={size}>
                    {product.quantity}
                  </Text>
                }
              />
            ))}
          </Fragment>
        ))}
    </>
  );
}
