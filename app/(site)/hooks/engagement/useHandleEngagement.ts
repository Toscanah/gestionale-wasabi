import { OrderType } from "@/prisma/generated/client/enums";
import { useState } from "react";
import {
  OrderByType,
  EngagementWithDetails,
  HomeOrder,
  PickupOrder,
  OrderGuards,
} from "../../lib/shared";
import { trpc } from "@/lib/server/client";

export type UseHandleEngagementParams =
  | { order: OrderByType; customerIds?: number[] }
  | { order?: OrderByType; customerIds: number[] };

export default function useHandleEngagement({ order, customerIds }: UseHandleEngagementParams) {
  if (!order && !customerIds) {
    throw new Error("Either 'order' or 'customerIds' must be provided.");
  }

  const utils = trpc.useUtils();
  const [selectedTemplates, setSelectedTemplates] = useState<number[]>([]);

  const orderId = order?.id;
  const singleCustomerId = order
    ? OrderGuards.isHome(order)
      ? order.home_order?.customer?.id
      : OrderGuards.isPickup(order)
        ? order.pickup_order?.customer?.id
        : undefined
    : undefined;

  const targetCustomerIds = customerIds ?? (singleCustomerId ? [singleCustomerId] : []);

  const onSelectTemplate = (templateId: number) =>
    setSelectedTemplates((prev) =>
      prev.includes(templateId) ? prev.filter((id) => id !== templateId) : [...prev, templateId]
    );

  const getEngagementsQuery = trpc.engagements.getByCustomer.useQuery(
    { customerId: singleCustomerId! },
    { enabled: !!singleCustomerId }
  );

  const createMutation = trpc.engagements.create.useMutation({
    onSuccess: () => utils.engagements.getByCustomer.invalidate(),
  });

  const deleteMutation = trpc.engagements.deleteEngagementById.useMutation({
    onSuccess: () => utils.engagements.getByCustomer.invalidate(),
  });

  const toggleMutation = trpc.engagements.toggleById.useMutation({
    onSuccess: () => utils.engagements.getByCustomer.invalidate(),
  });

  const getEngagements = async () => getEngagementsQuery.data ?? [];

  const createEngagements = async (): Promise<EngagementWithDetails[]> => {
    if (orderId) {
      const customerId = order
        ? OrderGuards.isHome(order)
          ? order.home_order?.customer?.id
          : OrderGuards.isPickup(order)
            ? order.pickup_order?.customer?.id
            : undefined
        : undefined;

      const results = await Promise.all(
        selectedTemplates.map((templateId) =>
          createMutation.mutateAsync({
            orderId,
            customerId,
            templateId,
          })
        )
      );

      return results.filter(Boolean) as EngagementWithDetails[];
    } else {
      const results = await Promise.all(
        targetCustomerIds.flatMap((customerId) =>
          selectedTemplates.map((templateId) =>
            createMutation.mutateAsync({
              customerId,
              templateId,
            })
          )
        )
      );

      return results.filter(Boolean) as EngagementWithDetails[];
    }
  };

  const deleteEngagement = async (engagementId: number) =>
    deleteMutation.mutateAsync({ engagementId });

  const toggleEngagement = async (engagementId: number) =>
    toggleMutation.mutateAsync({ engagementId });

  return {
    createEngagements,
    selectedTemplates,
    onSelectTemplate,
    deleteEngagement,
    toggleEngagement,
  };
}
