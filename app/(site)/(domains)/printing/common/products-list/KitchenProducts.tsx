import fitReceiptText from "@/app/(site)/lib/utils/domains/printing/fitReceiptText";
import { Fragment } from "react";
import { Line, Text } from "react-thermal-printer";
import { uniqueId } from "lodash";
import { GroupedProductsByOptions, ProductLineProps } from "./ProductsListSection";
import sanitazeReceiptText from "@/app/(site)/lib/utils/domains/printing/sanitazeReceiptText";
import { BIG_PRINT, SMALL_PRINT } from "../../constants";
import splitOptionsInLines from "@/app/(site)/lib/utils/domains/printing/splitOptionsIntoLines";

interface KitchenProductsProps {
  groupedProducts: GroupedProductsByOptions;
}

const CODE_MAX_LENGTH = 4;
const CODE_PADDING = 2;
const DESC_MAX_LENGTH = 27;
const DESC_PADDING_SHORT = 5;
const DESC_PADDING_LONG = 7;
const VAR_LEFT_PADDING = 4;

export default function KitchenProducts({ groupedProducts }: KitchenProductsProps) {
  const ProductLine = ({ product }: ProductLineProps) => {
    const to_print_qty = product.to_be_printed ?? 0;

    return (
      <Fragment key={uniqueId()}>
        <Text inline bold size={BIG_PRINT}>
          {fitReceiptText(
            sanitazeReceiptText(product.product.code.toUpperCase()),
            CODE_MAX_LENGTH,
            CODE_PADDING
          )}
        </Text>

        <Text inline bold size={SMALL_PRINT}>
          {fitReceiptText(
            sanitazeReceiptText(product.product.desc),
            DESC_MAX_LENGTH,
            String(to_print_qty).length > 1 ? DESC_PADDING_SHORT : DESC_PADDING_LONG
          )}
        </Text>

        <Text bold size={BIG_PRINT}>
          {fitReceiptText(to_print_qty.toString(), String(to_print_qty).length)}
        </Text>

        {product.variation && (
          <Text bold size={BIG_PRINT}>
            {" ".repeat(VAR_LEFT_PADDING) + sanitazeReceiptText(product.variation)}
          </Text>
        )}
      </Fragment>
    );
  };

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
              <Text bold size={SMALL_PRINT} key={`options-${idx}-${lineIdx}`}>
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
