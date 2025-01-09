// import { ProductInOrder } from "@/app/(site)/models";
// import applyDiscount from "@/app/(site)/functions/order-management/applyDiscount";
// import roundToTwo from "@/app/(site)/functions/formatting-parsing/roundToTwo";
// import padReceiptText from "@/app/(site)/functions/formatting-parsing/printing/padReceiptText";
// import { Br, Row, Text } from "react-thermal-printer";
// import TotalSection from "../TotalSection";
// import { Fragment } from "react";
// import { getProductPrice } from "@/app/(site)/functions/product-management/getProductPrice";
// import { OrderType } from "@prisma/client";
// import joinItemsWithComma from "@/app/(site)/functions/formatting-parsing/joinItemsWithComma";
// import { ProductLineProps } from "./KitchenProducts";
// import { uniqueId } from "lodash";
// import splitOptionsInLines from "@/app/(site)/functions/formatting-parsing/printing/splitOptionsInLines";

// const PRODUCT_HEADER_MAX = 23;
// const PRODUCT_HEADER_PADDING = 5;
// const UNIT_PRICE_HEADER_MAX = 7;

// const PRODUCT_CODE_LENGTH = 4;
// const DESCRIPTION_LENGTH = 16;
// const QUANTITY_PRICE_LENGTH = 10;
// const MAX_TOTAL_LENGTH = 6;

// const DEFAULT_PADDING = 4;

// const calculateDiscountAmount = (products: ProductInOrder[], discount: number) => {
//   const total = products.reduce((acc, product) => acc + product.total, 0);
//   return total - applyDiscount(total, discount);
// };

// interface CustomerProductsProps {
//   discount: number;
//   aggregatedProducts: ProductInOrder[];
//   orderType: OrderType;
// }

// export default function CustomerProducts({
//   discount,
//   aggregatedProducts,
//   orderType,
// }: CustomerProductsProps) {
//   const ProductLine = ({ product }: ProductLineProps) => {
//     const actualTotalLength = Math.min(roundToTwo(product.total).length, MAX_TOTAL_LENGTH);
//     const additionalPadding = MAX_TOTAL_LENGTH - actualTotalLength;

//     return (
//       <Fragment key={uniqueId()}>
//         <Text inline>
//           {padReceiptText(product.product.code.toUpperCase(), PRODUCT_CODE_LENGTH, DEFAULT_PADDING)}
//         </Text>

//         <Text inline>
//           {padReceiptText(product.product.desc, DESCRIPTION_LENGTH, DEFAULT_PADDING)}
//         </Text>

//         <Text inline>
//           {padReceiptText(
//             product.quantity + " x " + roundToTwo(getProductPrice(product, orderType)),
//             QUANTITY_PRICE_LENGTH,
//             DEFAULT_PADDING + additionalPadding
//           )}
//         </Text>

//         <Text>{padReceiptText(roundToTwo(product.total), actualTotalLength)}</Text>
//       </Fragment>
//     );
//   };

//   const maxActualTotalLength = Math.max(
//     ...aggregatedProducts.map((product) =>
//       Math.min(roundToTwo(product.total).length, MAX_TOTAL_LENGTH)
//     )
//   );

//   let dynamicUnitPricePadding = UNIT_PRICE_HEADER_MAX + (MAX_TOTAL_LENGTH - maxActualTotalLength);

//   if (maxActualTotalLength <= 4) {
//     dynamicUnitPricePadding = dynamicUnitPricePadding - 1;
//   }

//   return (
//     <>
//       <Text>
//         {padReceiptText("Prodotto", PRODUCT_HEADER_MAX, PRODUCT_HEADER_PADDING)}
//         {padReceiptText("P.Unit.", UNIT_PRICE_HEADER_MAX, dynamicUnitPricePadding)}
//         Tot €
//       </Text>

//       <Br />

//       {aggregatedProducts.map((product, index) => (
//         <Fragment key={product + "-" + index}>
//           {ProductLine({ product })}

//           {product.additional_note !== "" && (
//             <Text>
//               {" ".repeat(4)}
//               {product.additional_note}
//             </Text>
//           )}

//           {/* {product.options.length > 0 && (
//             <Text>
//               {" ".repeat(4)}
//               {joinItemsWithComma(product, "options", { maxChar: 15 })}
//             </Text>
//           )} */}

//           {product.options.length > 0 &&
//             splitOptionsInLines(joinItemsWithComma(product, "options", { maxChar: 15 }), 48, 4).map(
//               (line, index) => <Text key={`option-line-${index}`}>{line}</Text>
//             )}
//         </Fragment>
//       ))}

//       {discount > 0 && (
//         <Row
//           left={<Text>- {discount}%</Text>}
//           right={
//             <Text>- {roundToTwo(calculateDiscountAmount(aggregatedProducts, discount))}</Text>
//           }
//         />
//       )}

//       {TotalSection(aggregatedProducts, discount, true)}
//       <Br />
//     </>
//   );
// }

import { ProductInOrder } from "@/app/(site)/models";
import applyDiscount from "@/app/(site)/functions/order-management/applyDiscount";
import roundToTwo from "@/app/(site)/functions/formatting-parsing/roundToTwo";
import padReceiptText from "@/app/(site)/functions/formatting-parsing/printing/padReceiptText";
import { Br, Row, Text } from "react-thermal-printer";
import TotalSection from "../TotalSection";
import { Fragment } from "react";
import { getProductPrice } from "@/app/(site)/functions/product-management/getProductPrice";
import { OrderType } from "@prisma/client";
import joinItemsWithComma from "@/app/(site)/functions/formatting-parsing/joinItemsWithComma";
import { ProductLineProps } from "./KitchenProducts";
import { uniqueId } from "lodash";
import splitOptionsInLines from "@/app/(site)/functions/formatting-parsing/printing/splitOptionsInLines";

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
  aggregatedProducts: ProductInOrder[];
  orderType: OrderType;
}

export default function CustomerProducts({
  discount,
  aggregatedProducts,
  orderType,
}: CustomerProductsProps) {
  const ProductLine = ({ product }: ProductLineProps) => {
    return (
      <Fragment key={uniqueId()}>
        <Text inline>
          {padReceiptText(product.quantity.toString(), MAX_QUANTITY_WIDTH, QUANTITY_PADDING)}
        </Text>

        <Text inline>
          {padReceiptText(product.product.code.toUpperCase(), MAX_CODE_WIDTH, CODE_PADDING)}
        </Text>

        <Text inline>
          {padReceiptText(product.product.desc, MAX_DESCRIPTION_WIDTH, DESCRIPTION_PADDING)}
        </Text>

        <Text inline>
          {padReceiptText(
            roundToTwo(getProductPrice(product, orderType)),
            MAX_PRICE_WIDTH,
            PRICE_PADDING
          )}
        </Text>

        <Text>{padReceiptText(roundToTwo(product.total), MAX_TOTAL_WIDTH, 0)}</Text>
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

      {aggregatedProducts.map((product, index) => (
        <Fragment key={product + "-" + index}>
          {ProductLine({ product })}

          {product.additional_note !== "" && (
            <Text>
              {padReceiptText(
                product.additional_note ?? "",
                TOTAL_ROW_WIDTH - OPTIONS_START_PADDING
              ).padStart(OPTIONS_START_PADDING, " ")}
            </Text>
          )}

          {product.options.length > 0 &&
            splitOptionsInLines(
              joinItemsWithComma(product, "options", { maxChar: 15 }),
              TOTAL_ROW_WIDTH,
              OPTIONS_START_PADDING
            ).map((line, index) => <Text key={`option-line-${index}`}>{line}</Text>)}
        </Fragment>
      ))}

      {discount > 0 && (
        <Row
          left={<Text>- {discount}%</Text>}
          right={<Text>- {roundToTwo(calculateDiscountAmount(aggregatedProducts, discount))}</Text>}
        />
      )}

      {TotalSection(aggregatedProducts, discount, true)}
      <Br />
    </>
  );
}
