import { OrderType } from "@prisma/client";
import { useState } from "react";
import fetchRequest from "../../lib/api/fetchRequest";
import { AnyOrder, EngagementWithDetails, HomeOrder, PickupOrder } from "../../shared";

export type UseHandleEngagementParams =
  | { order: AnyOrder; customerIds?: number[] }
  | { order?: AnyOrder; customerIds: number[] };

export default function useHandleEngagement({ order, customerIds }: UseHandleEngagementParams) {
  if (!order && !customerIds) {
    throw new Error("Either 'order' or 'customerIds' must be provided.");
  }

  const [selectedTemplates, setSelectedTemplates] = useState<number[]>([]);

  const orderId = order?.id;
  const singleCustomerId =
    order?.type === OrderType.HOME
      ? (order as HomeOrder).home_order?.customer?.id
      : order?.type === OrderType.PICKUP
      ? (order as PickupOrder).pickup_order?.customer?.id
      : undefined;

  const targetCustomerIds = customerIds ?? (singleCustomerId ? [singleCustomerId] : []);

  const onSelectTemplate = (templateId: number) =>
    setSelectedTemplates((prev) =>
      prev.includes(templateId) ? prev.filter((id) => id !== templateId) : [...prev, templateId]
    );

  const getEngagements = async () => {
    if (!singleCustomerId) return [];
    return await fetchRequest<EngagementWithDetails[]>(
      "GET",
      "/api/engagements/",
      "getEngagementsByCustomer",
      {
        customerId: singleCustomerId,
      }
    );
  };

  // TODO: should check if instead of EngagementWithDetails,
  // undefined was returned = engagement with that templete already exists
  const createEngagements = async (): Promise<EngagementWithDetails[]> => {
    if (orderId) {
      const customerId =
        order.type === OrderType.HOME
          ? (order as HomeOrder).home_order?.customer?.id
          : order.type === OrderType.PICKUP
          ? (order as PickupOrder).pickup_order?.customer?.id
          : undefined;

      const results = await Promise.all(
        selectedTemplates.map((templateId) =>
          fetchRequest<EngagementWithDetails | null>(
            "POST",
            "/api/engagements/",
            "createEngagement",
            {
              orderId,
              customerId,
              templateId,
            }
          )
        )
      );

      return results.filter(Boolean) as EngagementWithDetails[];
    } else {
      const results = await Promise.all(
        targetCustomerIds.flatMap((customerId) =>
          selectedTemplates.map((templateId) =>
            fetchRequest<EngagementWithDetails | null>(
              "POST",
              "/api/engagements/",
              "createEngagement",
              {
                customerId,
                templateId,
              }
            )
          )
        )
      );

      return results.filter(Boolean) as EngagementWithDetails[];
    }
  };

  const deleteEngagement = async (engagementId: number) =>
    fetchRequest<number>("DELETE", "/api/engagements", "deleteEngagementById", {
      engagementId,
    });

  return {
    createEngagements,
    getEngagements,
    selectedTemplates,
    onSelectTemplate,
    deleteEngagement,
  };
}
