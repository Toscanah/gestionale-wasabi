import { OrderType } from "@prisma/client";
import { useState } from "react";
import { AnyOrder, EngagementWithDetails, HomeOrder, PickupOrder } from "../../lib/shared";
import { trpc } from "@/lib/server/client";

export type UseHandleEngagementParams =
  | { order: AnyOrder; customerIds?: number[] }
  | { order?: AnyOrder; customerIds: number[] };

export default function useHandleEngagement({ order, customerIds }: UseHandleEngagementParams) {
  if (!order && !customerIds) {
    throw new Error("Either 'order' or 'customerIds' must be provided.");
  }

  const utils = trpc.useUtils();
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
      const customerId =
        order?.type === OrderType.HOME
          ? (order as HomeOrder).home_order?.customer?.id
          : order?.type === OrderType.PICKUP
            ? (order as PickupOrder).pickup_order?.customer?.id
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
