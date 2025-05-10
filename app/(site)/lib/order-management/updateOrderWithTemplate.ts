import {
  AnyOrder,
  EngagementWithDetails,
  HomeOrder,
  ParsedEngagementTemplate,
  PickupOrder,
} from "../../shared";
import { OrderType } from "@prisma/client";

export function updateOrderWithTemplate(
  order: AnyOrder,
  updatedTemplate: ParsedEngagementTemplate
): AnyOrder {
  const updateEngagements = (engagements: EngagementWithDetails[] | undefined) =>
    engagements?.map((e) =>
      e.template.id === updatedTemplate.id ? { ...e, template: updatedTemplate } : e
    ) ?? [];

  const updatedOrder: AnyOrder = {
    ...order,
    engagements: updateEngagements(order.engagements),
  };

  if (order.type === OrderType.HOME) {
    const homeOrder = (order as HomeOrder).home_order;
    if (!homeOrder) {
      return updatedOrder;
    }

    return {
      ...updatedOrder,
      home_order: {
        ...homeOrder,
        customer: {
          ...homeOrder.customer,
          engagements: updateEngagements(homeOrder.customer?.engagements),
        },
      },
    };
  }

  if (order.type === OrderType.PICKUP) {
    const pickupOrder = (order as PickupOrder).pickup_order;
    if (!pickupOrder) {
      return updatedOrder;
    }

    return {
      ...updatedOrder,
      pickup_order: {
        ...pickupOrder,
        customer: pickupOrder.customer
          ? {
              ...pickupOrder.customer,
              engagements: updateEngagements(pickupOrder.customer?.engagements),
            }
          : null,
      },
    };
  }

  return updatedOrder;
}
