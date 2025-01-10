import { ProductInOrder } from "@/app/(site)/models";
import padReceiptText from "@/app/(site)/functions/formatting-parsing/printing/padReceiptText";
import getReceiptSize from "@/app/(site)/functions/formatting-parsing/printing/getReceiptSize";
import { Fragment } from "react";
import { Line, Text } from "react-thermal-printer";
import { uniqueId } from "lodash";
import splitOptionsInLines from "@/app/(site)/functions/formatting-parsing/printing/splitOptionsInLines";
import { GroupedProductsByOptions } from "./ProductsListSection";

export interface ProductLineProps {
  product: ProductInOrder;
}

interface KitchenProductsProps {
  groupedProducts: GroupedProductsByOptions;
}

export default function KitchenProducts({ groupedProducts }: KitchenProductsProps) {
  const bigSize = getReceiptSize(2, 2);
  const smallSize = getReceiptSize(1, 1);

  const ProductLine = ({ product }: ProductLineProps) => (
    <Fragment key={uniqueId()}>
      <Text inline bold size={bigSize}>
        {padReceiptText(product.product.code.toUpperCase(), 4, 2)}
      </Text>

      <Text inline bold size={smallSize}>
        {padReceiptText(product.product.desc, 27, String(product.quantity).length > 1 ? 5 : 7)}
      </Text>

      <Text bold size={bigSize}>
        {padReceiptText(product.quantity.toString(), String(product.quantity).length)}
      </Text>

      {product.additional_note !== "" && (
        <Text bold size={smallSize}>
          {" ".repeat(4) + product.additional_note}
        </Text>
      )}
    </Fragment>
  );

  return (
    <>
      {groupedProducts["no_options"]?.map((product) => ProductLine({ product }))}

      {groupedProducts["no_options"]?.length > 0 && <Line />}

      {Object.entries(groupedProducts)
        .filter(([key]) => key !== "no_options")
        .map(([optionsKey, products], idx, arr) => (
          <Fragment key={`group-${idx}`}>
            {products.map((product) => ProductLine({ product }))}

            {splitOptionsInLines(optionsKey, 48, 4).map((line, lineIdx) => (
              <Text bold size={smallSize} key={`options-${idx}-${lineIdx}`}>
                {line}
              </Text>
            ))}

            {idx < arr.length - 1 && arr.length > 1 && <Line />}
          </Fragment>
        ))}

      {Object.entries(groupedProducts).filter(([key]) => key !== "no_options").length > 0 && (
        <Line />
      )}
    </>
  );
}
