import { ProductInOrderType } from "@/app/(site)/types/ProductInOrderType";
import formatReceiptText from "@/app/(site)/util/functions/formatReceiptText";
import { Fragment } from "react";
import { Line, Row, Text, TextSize } from "react-thermal-printer";

export default function KitchenProducts({
  aggregatedProducts,
}: {
  aggregatedProducts: ProductInOrderType[];
}) {
  const size: { width: TextSize; height: TextSize } = { width: 2, height: 2 };
  const groupedProducts: { [key: string]: ProductInOrderType[] } = {};

  aggregatedProducts.forEach((product) => {
    const optionsKey =
      product.options.length === 0
        ? "no_options"
        : product.options
            .map(({ option }) => option.option_name.slice(0, 6))
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
          left={formatReceiptText(
            `${product.product.code.toUpperCase()} ${product.product.desc}`,
            22,
            String(product.quantity).length > 1 ? 0 : 1
          )}
          right={formatReceiptText(String(product.quantity), 2, 5).trim()}
        />
      ))}

      {groupedProducts["no_options"]?.length > 0 && <Line character="*" />}

      {Object.entries(groupedProducts)
        .filter(([key]) => key !== "no_options")
        .map(([optionsKey, products], idx, arr) => (
          <Fragment key={idx}>
            {products.map((product, index) => (
              <Text bold size={size} key={`${product.product.code}-${index}`}>
                {formatReceiptText(
                  `${product.product.code.toUpperCase()} ${product.product.desc}`,
                  22,
                  String(product.quantity).length > 1 ? 0 : 1
                )}

                {formatReceiptText(String(product.quantity), 2, 5).trim()}
              </Text>
            ))}

            {" - " + formatReceiptText(optionsKey, 24)}
            {idx < arr.length - 1 && <Line character="*" />}
          </Fragment>
        ))}
    </>
  );
}
