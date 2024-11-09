import { ProductInOrderType } from "@/app/(site)/types/ProductInOrderType";
import formatReceiptText from "@/app/(site)/util/functions/formatReceiptText";
import { Fragment } from "react";
import { Br, Line, Row, Text, TextSize } from "react-thermal-printer";

export default function KitchenProducts({
  aggregatedProducts,
}: {
  aggregatedProducts: ProductInOrderType[];
}) {
  const size = (w: TextSize, h: TextSize): { width: TextSize; height: TextSize } => ({
    width: w,
    height: h,
  });
  const groupedProducts: { [key: string]: ProductInOrderType[] } = {};

  aggregatedProducts.forEach((product) => {
    const optionsKey =
      product.options.length === 0
        ? "no_options"
        : product.options
            .map(({ option }) => option.option_name)
            .sort()
            .join(", ");

    if (!groupedProducts[optionsKey]) {
      groupedProducts[optionsKey] = [];
    }

    const existingProductIndex = groupedProducts[optionsKey].findIndex(
      (item) => item.product.code === product.product.code
    );

    if (existingProductIndex !== -1) {
      groupedProducts[optionsKey][existingProductIndex].quantity += product.quantity;
    } else {
      groupedProducts[optionsKey].push({
        ...product,
        options: product.options.map((option) => ({
          ...option,
          option_name: option.option.option_name.slice(0, 6),
        })),
      });
    }
  });

  return (
    <>
      {groupedProducts["no_options"]?.map((product, index) => (
        <Row
          key={index}
          left={
            <Text bold size={size(2, 2)}>
              {formatReceiptText(
                `${product.product.code.toUpperCase()} ${product.product.desc}`,
                23,
                String(product.quantity).length > 1 ? 0 : 1
              )}
            </Text>
          }
          right={
            <Text bold size={size(2, 2)} align="right">
              {String(product.quantity).trim()}
            </Text>
          }
        />
      ))}

      {groupedProducts["no_options"]?.length > 0 && <Line character="*" />}

      {Object.entries(groupedProducts)
        .filter(([key]) => key !== "no_options")
        .map(([optionsKey, products], idx, arr) => (
          <Fragment key={idx}>
            {products.map((product, index) => (
              <Text bold size={size(2, 2)} key={`${product.product.code}-${index}`}>
                {formatReceiptText(
                  `${product.product.code.toUpperCase()} ${product.product.desc}`,
                  22,
                  String(product.quantity).length > 1 ? 0 : 1
                )}

                {formatReceiptText(String(product.quantity), 2, 5).trim()}
              </Text>
            ))}

            <Text bold size={size(1, 1)}>
              {" - " + formatReceiptText(optionsKey, 24)}
            </Text>

            {idx < arr.length - 1 && arr.length > 1 && <Line character="=" />}
          </Fragment>
        ))}
    </>
  );
}
