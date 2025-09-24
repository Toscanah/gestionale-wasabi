import { OrderType } from "@prisma/client";
import { OrderByType, EngagementWithDetails, HomeOrder, ParsedEngagementTemplate, PickupOrder } from "../../shared";

interface PatchEngagementsParams {
  order: OrderByType;
  addEngagements?: EngagementWithDetails[];
  removeTemplateIds?: number[];
  updateTemplates?: ParsedEngagementTemplate[];
  updateEngagements?: Partial<EngagementWithDetails>[];
  replaceEngagements?: EngagementWithDetails[];
}

export function patchOrderEngagements({
  order,
  addEngagements = [],
  removeTemplateIds = [],
  updateTemplates = [],
  updateEngagements = [],
  replaceEngagements,
}: PatchEngagementsParams): OrderByType {
  const patchEngagementList = (
    existing: EngagementWithDetails[] | undefined
  ): EngagementWithDetails[] => {
    if (replaceEngagements) return replaceEngagements;

    let patched = existing ?? [];

    // Remove unwanted templates (by engagement ID)
    if (removeTemplateIds.length > 0) {
      patched = patched.filter((e) => !removeTemplateIds.includes(e.id));
    }

    // Apply template updates
    if (updateTemplates.length > 0) {
      patched = patched.map((e) => {
        const updatedTemplate = updateTemplates.find((t) => t.id === e.template.id);
        return updatedTemplate ? { ...e, template: updatedTemplate } : e;
      });
    }

    // Apply engagement-level updates (like enabled toggle)
    if (updateEngagements && updateEngagements.length > 0) {
      patched = patched.map((e) => {
        const patch = updateEngagements.find((u) => u.id === e.id);
        return patch ? { ...e, ...patch } : e;
      });
    }

    // Add new engagements
    return [...patched, ...addEngagements];
  };

  const patchedEngagements = patchEngagementList(order.engagements);
  const baseOrder: OrderByType = { ...order, engagements: patchedEngagements };

  if (order.type == OrderType.HOME) {
    const home = (order as HomeOrder).home_order;
    if (!home) return baseOrder;

    return {
      ...baseOrder,
      home_order: {
        ...home,
        customer: {
          ...home.customer,
          engagements: patchEngagementList(home.customer.engagements),
        },
      },
    };
  }

  if (order.type === OrderType.PICKUP) {
    const pickup = (order as PickupOrder).pickup_order;
    if (!pickup) return baseOrder;

    return {
      ...baseOrder,
      pickup_order: {
        ...pickup,
        customer: pickup.customer
          ? {
              ...pickup.customer,
              engagements: patchEngagementList(pickup.customer.engagements),
            }
          : null,
      },
    };
  }

  return baseOrder;
}
