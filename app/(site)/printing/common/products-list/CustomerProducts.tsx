import { ProductInOrder } from "@/app/(site)/models";
import applyDiscount from "@/app/(site)/functions/order-management/applyDiscount";
import roundToTwo from "@/app/(site)/functions/formatting-parsing/roundToTwo";
import padReceiptText from "@/app/(site)/functions/formatting-parsing/printing/padReceiptText";
import { Br, Row, Text } from "react-thermal-printer";
import TotalSection from "../TotalSection";
import { Fragment } from "react";
import { getProductPrice } from "@/app/(site)/functions/product-management/getProductPrice";
import { OrderType } from "@prisma/client";
import { uniqueId } from "lodash";
import splitOptionsInLines from "@/app/(site)/functions/formatting-parsing/printing/splitOptionsInLines";
import { GroupedProductsByOptions, ProductLineProps } from "./ProductsListSection";
import sanitazeReceiptText from "@/app/(site)/functions/formatting-parsing/printing/sanitazeReceiptText";

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

const calculateDiscountAmount = (products: ProductInOrder[], discount: number) => {
  const total = products.reduce((acc, product) => acc + product.total, 0);
  return total - applyDiscount(total, discount);
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
          {padReceiptText(product.quantity.toString(), MAX_QUANTITY_WIDTH, QUANTITY_PADDING)}
        </Text>

        <Text inline>
          {padReceiptText(
            sanitazeReceiptText(product.product.code.toUpperCase()),
            MAX_CODE_WIDTH,
            CODE_PADDING
          )}
        </Text>

        <Text inline>
          {padReceiptText(
            sanitazeReceiptText(product.product.desc),
            MAX_DESCRIPTION_WIDTH,
            DESCRIPTION_PADDING
          )}
        </Text>

        <Text inline>
          {padReceiptText(
            roundToTwo(getProductPrice(product, orderType)),
            MAX_PRICE_WIDTH,
            PRICE_PADDING
          )}
        </Text>

        <Text>{padReceiptText(roundToTwo(product.total), MAX_TOTAL_WIDTH, 0)}</Text>

        {product.additional_note && (
          <Text>{" ".repeat(4) + sanitazeReceiptText(product.additional_note)}</Text>
        )}
      </Fragment>
    );
  };

  return (
    <>
      <Text>
        {padReceiptText(QUANTITY_TITLE, HEAD_QUANTITY_MAX, HEAD_QUANTITY_PADDING)}
        {padReceiptText(PRODUCT_TITLE, HEAD_PRODUCT_MAX, HEAD_PRODUCT_PADDING)}
        {padReceiptText(PRICE_TITLE, HEAD_PRICE_MAX, HEAD_PRICE_PADDING)}
        {padReceiptText(TOTAL_TITLE, HEAD_TOTAL_MAX, 0)}
      </Text>

      <Br />

      {Object.entries(groupedProducts)
        .filter(([key]) => key !== "no_options")
        .map(([optionsKey, products], idx, arr) => (
          <Fragment key={`group-${idx}`}>
            {products.map((product) => ProductLine({ product }))}

            {splitOptionsInLines(optionsKey, TOTAL_ROW_WIDTH, OPTIONS_START_PADDING).map(
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
          right={<Text>- {roundToTwo(calculateDiscountAmount(originalProducts, discount))}</Text>}
        />
      )}

      {TotalSection(originalProducts, discount, true)}
      <Br />
    </>
  );
}
