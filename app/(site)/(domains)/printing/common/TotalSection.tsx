import { Br, Text } from "react-thermal-printer";
import { ProductInOrder, PromotionByType, PromotionUsageWithPromotion } from "@/lib/shared";
import roundToTwo from "../../../../../lib/shared/utils/global/number/roundToTwo";
import { OrderType } from "@/prisma/generated/client/enums";
import { getOrderTotal } from "../../../../../lib/services/order-management/getOrderTotal";
import { BIG_PRINT } from "@/lib/shared";
import toEuro from "@/lib/shared/utils/global/string/toEuro";
import { PromotionUsage } from "@/prisma/generated/client/client";

interface TotalSectionProps {
  products: ProductInOrder[];
  promotionsUsages?: PromotionUsageWithPromotion[];
  discount: number;
  orderType: OrderType;
}

export default function TotalSection({
  products,
  discount,
  orderType,
  promotionsUsages,
}: TotalSectionProps) {
  return (
    <>
      <Br />

      <Text size={BIG_PRINT} align="center" bold>
        {`TOTALE: ${toEuro(
          getOrderTotal({
            order: { products, discount, type: orderType, promotion_usages: promotionsUsages },
            applyDiscounts: true,
          }),
        )}`}
      </Text>
    </>
  );
}
