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

const PRODUCT_HEADER_MAX = 23;
const PRODUCT_HEADER_PADDING = 5;
const UNIT_PRICE_HEADER_MAX = 7;

const PRODUCT_CODE_LENGTH = 4;
const DESCRIPTION_LENGTH = 16;
const QUANTITY_PRICE_LENGTH = 10;
const MAX_TOTAL_LENGTH = 6;

const DEFAULT_PADDING = 4;

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
    const actualTotalLength = Math.min(roundToTwo(product.total).length, MAX_TOTAL_LENGTH);
    const additionalPadding = MAX_TOTAL_LENGTH - actualTotalLength;

    return (
      <Fragment key={uniqueId()}>
        <Text inline>
          {padReceiptText(product.product.code.toUpperCase(), PRODUCT_CODE_LENGTH, DEFAULT_PADDING)}
        </Text>

        <Text inline>
          {padReceiptText(product.product.desc, DESCRIPTION_LENGTH, DEFAULT_PADDING)}
        </Text>

        <Text inline>
          {padReceiptText(
            product.quantity + " x " + roundToTwo(getProductPrice(product, orderType)),
            QUANTITY_PRICE_LENGTH,
            DEFAULT_PADDING + additionalPadding
          )}
        </Text>

        <Text>{padReceiptText(roundToTwo(product.total), actualTotalLength)}</Text>
      </Fragment>
    );
  };

  const maxActualTotalLength = Math.max(
    ...aggregatedProducts.map((product) =>
      Math.min(roundToTwo(product.total).length, MAX_TOTAL_LENGTH)
    )
  );

  let dynamicUnitPricePadding = UNIT_PRICE_HEADER_MAX + (MAX_TOTAL_LENGTH - maxActualTotalLength);

  if (maxActualTotalLength <= 4) {
    dynamicUnitPricePadding = dynamicUnitPricePadding - 1;
  }

  return (
    <>
      <Text>
        {padReceiptText("Prodotto", PRODUCT_HEADER_MAX, PRODUCT_HEADER_PADDING)}
        {padReceiptText("P.Unit.", UNIT_PRICE_HEADER_MAX, dynamicUnitPricePadding)}
        Tot €
      </Text>

      <Br />

      {aggregatedProducts.map((product, index) => (
        <Fragment key={product + "-" + index}>
          {ProductLine({ product })}

          {product.additional_note !== "" && (
            <Text>
              {" ".repeat(4)}
              {product.additional_note}
            </Text>
          )}

          {/* {product.options.length > 0 && (
            <Text>
              {" ".repeat(4)}
              {joinItemsWithComma(product, "options", { maxChar: 15 })}
            </Text>
          )} */}

          {product.options.length > 0 &&
            splitOptionsInLines(joinItemsWithComma(product, "options", { maxChar: 15 }), 48, 4).map(
              (line, index) => <Text key={`option-line-${index}`}>{line}</Text>
            )}
        </Fragment>
      ))}

      {discount > 0 && (
        <Row
          left={<Text>- {discount}%</Text>}
          right={
            <Text>- {roundToTwo(calculateDiscountAmount(aggregatedProducts, discount))}</Text>
          }
        />
      )}

      {TotalSection(aggregatedProducts, discount, true)}
      <Br />
    </>
  );
}

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
// const QUANTITY_LENGTH = 4;
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
//           {padReceiptText(product.quantity.toString(), QUANTITY_LENGTH, DEFAULT_PADDING)}
//         </Text>

//         <Text inline>
//           {padReceiptText(product.product.code.toUpperCase(), PRODUCT_CODE_LENGTH, DEFAULT_PADDING)}
//         </Text>

//         <Text inline>
//           {padReceiptText(product.product.desc, DESCRIPTION_LENGTH, DEFAULT_PADDING)}
//         </Text>

//         <Text inline>
//           {padReceiptText(
//             roundToTwo(getProductPrice(product, orderType)).toString(),
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
//         {padReceiptText("Q", QUANTITY_LENGTH, DEFAULT_PADDING)}
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

//           {product.options.length > 0 &&
//             splitOptionsInLines(joinItemsWithComma(product, "options", { maxChar: 15 }), 48, 4).map(
//               (line, index) => <Text key={`option-line-${index}`}>{line}</Text>
//             )}
//         </Fragment>
//       ))}

//       {discount > 0 && (
//         <Row
//           left={<Text>- {discount}%</Text>}
//           right={<Text>- {roundToTwo(calculateDiscountAmount(aggregatedProducts, discount))}</Text>}
//         />
//       )}

//       {TotalSection(aggregatedProducts, discount, true)}
//       <Br />
//     </>
//   );
// }
