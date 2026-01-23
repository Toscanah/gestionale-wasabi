import { Row, Text } from "react-thermal-printer";
import { OrderByType } from "../../../lib/shared/models/Order";
import roundToTwo from "@/app/(site)/lib/utils/global/number/roundToTwo";
import { ProductInOrder } from "@/app/(site)/lib/shared";
import getDiscountedTotal from "@/app/(site)/lib/services/order-management/getDiscountedTotal";
import { PromotionType } from "@/prisma/generated/client/enums";

interface PromotionSectionProps {
  order: OrderByType;
}

const calculateDiscountAmount = (products: ProductInOrder[], discount: number) => {
  const total = products.reduce((acc, product) => acc + product.quantity * product.frozen_price, 0);
  return total - getDiscountedTotal({ orderTotal: total, discountPercentage: discount });
};

export default function PromotionSection({ order }: PromotionSectionProps) {
  const { discount, products: originalProducts, promotion_usages } = order;

  const hasPromotionUsage = promotion_usages && promotion_usages.length > 0;
  const hasDiscount = discount && discount > 0;

  if (!hasPromotionUsage && !hasDiscount) {
    return null;
  }

  const giftCards = promotion_usages.filter(
    (usage) => usage.promotion.type === PromotionType.GIFT_CARD,
  );

  const fixedDiscounts = promotion_usages.filter(
    (usage) => usage.promotion.type === PromotionType.FIXED_DISCOUNT,
  );
  
  const percentageDiscounts = promotion_usages.filter(
    (usage) => usage.promotion.type === PromotionType.PERCENTAGE_DISCOUNT,
  );

  return (
    <>
      <Text bold>Sconti e promozioni</Text>

      {discount > 0 && (
        <Row
          left={<Text>- {discount}%</Text>}
          right={<Text>- {roundToTwo(calculateDiscountAmount(originalProducts, discount))}</Text>}
        />
      )}

      {giftCards.map((usage) => (
        <Row
          key={usage.id}
          left={<Text>{usage.promotion.label}</Text>}
          right={<Text>- {roundToTwo(usage.amount)}</Text>}
        />
      ))}

      {fixedDiscounts.map((usage) => (
        <Row
          key={usage.id}
          left={<Text>{usage.promotion.label}</Text>}
          right={<Text>- {roundToTwo(usage.amount)}</Text>}
        />
      ))}

      {percentageDiscounts.map((usage) => (
        <Row
          key={usage.id}
          left={<Text>{usage.promotion.label}</Text>}
          right={<Text>- {roundToTwo(usage.amount)}</Text>}
        />
      ))}
    </>
  );
}
