import { Br, Text } from "react-thermal-printer";
import { ProductInOrder } from "@/app/(site)/lib/shared";
import roundToTwo from "../../../lib/utils/global/number/roundToTwo";
import { OrderType } from "@/prisma/generated/client/enums";
import { getOrderTotal } from "../../../lib/services/order-management/getOrderTotal";
import { BIG_PRINT } from "../../../lib/shared/constants/printing";
import toEuro from "@/app/(site)/lib/utils/global/string/toEuro";

interface TotalSectionProps {
  products: ProductInOrder[];
  discount: number;
  orderType: OrderType;
}

export default function TotalSection({ products, discount, orderType }: TotalSectionProps) {
  return (
    <>
      <Br />

      <Text size={BIG_PRINT} align="center" bold>
        {`TOTALE: ${toEuro(
          getOrderTotal({
            order: { products, discount, type: orderType },
            applyDiscounts: true,
          })
        )}`}
      </Text>
    </>
  );
}
