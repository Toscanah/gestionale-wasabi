import { Br, Text, TextSize } from "react-thermal-printer";
import { ProductInOrderType } from "../../types/ProductInOrderType";
import applyDiscount from "../../util/functions/applyDiscount";
import formatAmount from "../../util/functions/formatAmount";

export default function TotalSection(products: ProductInOrderType[], discount: number = 0) {
  const size: { width: TextSize; height: TextSize } = { width: 1, height: 1 };

  return (
    <>
      <Br />

      <Text size={size} align="center">
        {`TOTALE: ${formatAmount(
          applyDiscount(
            products.reduce((acc, product) => acc + product.total, 0),
            discount
          )
        )} €`}
      </Text>
    </>
  );
}
