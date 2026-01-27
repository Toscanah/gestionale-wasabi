import {
  OrderByType,
  EngagementWithDetails,
  ParsedEngagementTemplate,
} from "../../shared";
import { OrderGuards } from "../../shared/types/order-guards";

interface PatchEngagementsParams {
  order: OrderByType;
  addEngagements?: EngagementWithDetails[];
  removeTemplateIds?: number[];
  updateTemplates?: ParsedEngagementTemplate[];
  updateEngagements?: Partial<EngagementWithDetails>[];
  replaceEngagements?: EngagementWithDetails[];
}

export default function patchOrderEngagements({
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
    if (updateEngagements.length > 0) {
      patched = patched.map((e) => {
        const patch = updateEngagements.find((u) => u.id === e.id);
        return patch ? { ...e, ...patch } : e;
      });
    }

    // Add new engagements
    return [...patched, ...addEngagements];
  };

  // Always patch the top-level order.engagements
  const patchedEngagements = patchEngagementList(order.engagements);

  if (OrderGuards.isHome(order)) {
    return {
      ...order,
      engagements: patchedEngagements,
      home_order: {
        ...order.home_order,
        customer: {
          ...order.home_order.customer,
          engagements: patchEngagementList(order.home_order.customer.engagements),
        },
        address: order.home_order.address,
        messages: order.home_order.messages,
      },
    };
  }

  if (OrderGuards.isPickup(order)) {
    return {
      ...order,
      engagements: patchedEngagements,
      pickup_order: {
        ...order.pickup_order,
        customer: order.pickup_order.customer
          ? {
              ...order.pickup_order.customer,
              engagements: patchEngagementList(order.pickup_order.customer.engagements),
            }
          : null,
      },
    };
  }

  return { ...order, engagements: patchedEngagements };
}
