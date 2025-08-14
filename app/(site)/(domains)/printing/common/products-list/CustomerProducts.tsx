import { ProductInOrder } from "@/app/(site)/lib/shared";
import getDiscountedTotal from "@/app/(site)/lib/services/order-management/getDiscountedTotal";
import roundToTwo from "@/app/(site)/lib/formatting-parsing/roundToTwo";
import fitReceiptText from "@/app/(site)/lib/formatting-parsing/printing/fitReceiptText";
import { Br, Row, Text } from "react-thermal-printer";
import TotalSection from "../TotalSection";
import { Fragment } from "react";
import { OrderType } from "@prisma/client";
import { uniqueId } from "lodash";
import splitOptionsIntoLines from "@/app/(site)/lib/formatting-parsing/printing/splitOptionsIntoLines";
import { GroupedProductsByOptions, ProductLineProps } from "./ProductsListSection";
import sanitazeReceiptText from "@/app/(site)/lib/formatting-parsing/printing/sanitazeReceiptText";

const TOTAL_ROW_WIDTH = 48;

/** --- HEADER --- */
// QUANTITA'
const QUANTITY_TITLE = "Q.";
const HEAD_QUANTITY_MAX = QUANTITY_TITLE.length;
const HEAD_QUANTITY_PADDING = 3;

// PRODOTTO
const PRODUCT_TITLE = "Prodotto";
const HEAD_PRODUCT_MAX = PRODUCT_TITLE.length;

// PREZZO UNITARIO
const PRICE_TITLE = "P.Unit.";
const HEAD_PRICE_MAX = PRICE_TITLE.length;
const HEAD_PRICE_PADDING = 3;

// TOTALE
const TOTAL_TITLE = "Tot €";
const HEAD_TOTAL_MAX = TOTAL_TITLE.length;

/** --------------------------------------- */

/** --- RIGHE --- */
// QUANTITA'
const MAX_QUANTITY_WIDTH = 2;
const QUANTITY_PADDING = 3;

// PRODOTTO
// codice
const MAX_CODE_WIDTH = 4;
const CODE_PADDING = 3;

// descrizione
const DESCRIPTION_PADDING = 3;

// PREZZO UNITARIO
const MAX_PRICE_WIDTH = 5;
const PRICE_PADDING = HEAD_PRICE_MAX - MAX_PRICE_WIDTH + 3;

// TOTALE
const MAX_TOTAL_WIDTH = 6;

/** --------------------------------------- */

/* --- CALCOLATI --- */
const MAX_DESCRIPTION_WIDTH =
  TOTAL_ROW_WIDTH -
  (MAX_QUANTITY_WIDTH +
    QUANTITY_PADDING +
    MAX_CODE_WIDTH +
    CODE_PADDING +
    DESCRIPTION_PADDING +
    MAX_PRICE_WIDTH +
    PRICE_PADDING +
    MAX_TOTAL_WIDTH);

const HEAD_PRODUCT_PADDING =
  MAX_CODE_WIDTH + CODE_PADDING + MAX_DESCRIPTION_WIDTH + DESCRIPTION_PADDING - HEAD_PRODUCT_MAX;

/** --------------------------------------- */

/* --- ALTRO --- */
const OPTIONS_START_PADDING = 4;

const calculateDiscountAmount = (
  products: ProductInOrder[],
  discount: number,
  orderType: OrderType
) => {
  const total = products.reduce((acc, product) => acc + product.quantity * product.frozen_price, 0);
  return total - getDiscountedTotal({ orderTotal: total, discountPercentage: discount });
};

interface CustomerProductsProps {
  discount: number;
  groupedProducts: GroupedProductsByOptions;
  orderType: OrderType;
  originalProducts: ProductInOrder[];
}

export default function CustomerProducts({
  discount,
  groupedProducts,
  orderType,
  originalProducts,
}: CustomerProductsProps) {
  const ProductLine = ({ product }: ProductLineProps) => {
    return (
      <Fragment key={uniqueId()}>
        <Text inline>
          {fitReceiptText(product.quantity.toString(), MAX_QUANTITY_WIDTH, QUANTITY_PADDING)}
        </Text>

        <Text inline>
          {fitReceiptText(
            sanitazeReceiptText(product.product.code.toUpperCase()),
            MAX_CODE_WIDTH,
            CODE_PADDING
          )}
        </Text>

        <Text inline>
          {fitReceiptText(
            sanitazeReceiptText(product.product.desc),
            MAX_DESCRIPTION_WIDTH,
            DESCRIPTION_PADDING
          )}
        </Text>

        <Text inline>
          {fitReceiptText(String(roundToTwo(product.frozen_price)), MAX_PRICE_WIDTH, PRICE_PADDING)}
        </Text>

        <Text>
          {fitReceiptText(
            String(roundToTwo(product.quantity * product.frozen_price)),
            MAX_TOTAL_WIDTH,
            0
          )}
        </Text>

        {product.variation && <Text>{" ".repeat(4) + sanitazeReceiptText(product.variation)}</Text>}
      </Fragment>
    );
  };

  return (
    <>
      <Text>
        {fitReceiptText(QUANTITY_TITLE, HEAD_QUANTITY_MAX, HEAD_QUANTITY_PADDING)}
        {fitReceiptText(PRODUCT_TITLE, HEAD_PRODUCT_MAX, HEAD_PRODUCT_PADDING)}
        {fitReceiptText(PRICE_TITLE, HEAD_PRICE_MAX, HEAD_PRICE_PADDING)}
        {fitReceiptText(TOTAL_TITLE, HEAD_TOTAL_MAX, 0)}
      </Text>

      <Br />

      {Object.entries(groupedProducts)
        .filter(([key]) => key !== "no_options")
        .map(([optionsKey, products], idx, arr) => (
          <Fragment key={`group-${idx}`}>
            {products.map((product) => ProductLine({ product }))}

            {splitOptionsIntoLines(optionsKey, TOTAL_ROW_WIDTH, OPTIONS_START_PADDING).map(
              (line, lineIdx) => (
                <Text key={`options-${idx}-${lineIdx}`}>{line}</Text>
              )
            )}

            {idx < arr.length - 1 && arr.length > 1 && <Text align="center">---</Text>}
          </Fragment>
        ))}

      {Object.entries(groupedProducts).filter(([key]) => key !== "no_options").length > 0 && (
        <Text align="center">---</Text>
      )}

      {groupedProducts["no_options"]?.map((product) => ProductLine({ product }))}

      {groupedProducts["no_options"]?.length > 0 && <Text align="center">---</Text>}

      {discount > 0 && (
        <Row
          left={<Text>- {discount}%</Text>}
          right={
            <Text>
              - {roundToTwo(calculateDiscountAmount(originalProducts, discount, orderType))}
            </Text>
          }
        />
      )}

      {TotalSection({ products: originalProducts, discount, orderType })}
      <Br />
    </>
  );
}
