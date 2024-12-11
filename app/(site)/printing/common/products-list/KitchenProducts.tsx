import { ProductInOrderType } from "@/app/(site)/types/ProductInOrderType";
import formatReceiptText from "@/app/(site)/util/functions/formatReceiptText";
import getReceiptSize from "@/app/(site)/util/functions/getReceiptSize";
import { Fragment } from "react";
import { Br, Line, Row, Text, TextSize } from "react-thermal-printer";

export default function KitchenProducts({
  aggregatedProducts,
}: {
  aggregatedProducts: ProductInOrderType[];
}) {
  const groupedProducts: { [key: string]: ProductInOrderType[] } = {};
  const bigSize = getReceiptSize(2, 2);
  const smallSize = getReceiptSize(1, 1);

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

  const ProductLine = ({ product }: { product: ProductInOrderType }) => (
    <Fragment>
      <Text inline bold size={bigSize}>
        {formatReceiptText(product.product.code.toUpperCase(), 4, 2)}
      </Text>

      <Text inline bold size={smallSize}>
        {formatReceiptText(product.product.desc, 27, String(product.quantity).length > 1 ? 5 : 7)}
      </Text>

      <Text bold size={bigSize}>
        {formatReceiptText(product.quantity.toString(), String(product.quantity).length)}
      </Text>
    </Fragment>
  );

  return (
    <>
      {groupedProducts["no_options"]?.map((product, index) => ProductLine({ product }))}

      {groupedProducts["no_options"]?.length > 0 && <Line />}

      {Object.entries(groupedProducts)
        .filter(([key]) => key !== "no_options")
        .map(([optionsKey, products], idx, arr) => (
          <Fragment key={`group-${idx}`}>
            {products.map((product) => ProductLine({ product }))}

            <Text bold size={smallSize}>
              {" - " + formatReceiptText(optionsKey, 36)}
            </Text>

            {idx < arr.length - 1 && arr.length > 1 && <Line />}
          </Fragment>
        ))}
    </>
  );
}
