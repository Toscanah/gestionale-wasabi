import {
  AnyOrder,
  EngagementWithDetails,
  HomeOrder,
  ParsedEngagementTemplate,
  PickupOrder,
} from "../../shared";
import { OrderType } from "@prisma/client";

export function patchOrderEngagements({
  order,
  add = [],
  removeIds = [],
  updateTemplates = [],
}: {
  order: AnyOrder;
  add?: EngagementWithDetails[];
  removeIds?: number[];
  updateTemplates?: ParsedEngagementTemplate[];
}): AnyOrder {
  const updateEngagements = (
    engagements: EngagementWithDetails[] | undefined
  ): EngagementWithDetails[] => {
    let updated = engagements ?? [];

    // Remove by ID
    if (removeIds.length > 0) {
      updated = updated.filter((e) => !removeIds.includes(e.id));
    }

    // Update templates
    if (updateTemplates.length > 0) {
      updated = updated.map((e) => {
        const updatedTemplate = updateTemplates.find((t) => t.id === e.template.id);
        return updatedTemplate ? { ...e, template: updatedTemplate } : e;
      });
    }

    // Add new ones
    return [...updated, ...add];
  };

  const base = {
    ...order,
    engagements: updateEngagements(order.engagements),
  };

  if (order.type === OrderType.HOME) {
    const homeOrder = (order as HomeOrder).home_order;
    if (!homeOrder) return base;

    return {
      ...base,
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
    if (!pickupOrder) return base;

    return {
      ...base,
      pickup_order: {
        ...pickupOrder,
        customer: pickupOrder.customer
          ? {
              ...pickupOrder.customer,
              engagements: updateEngagements(pickupOrder.customer.engagements),
            }
          : null,
      },
    };
  }

  return base;
}
