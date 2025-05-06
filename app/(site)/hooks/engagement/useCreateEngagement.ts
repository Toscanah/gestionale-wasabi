import { Engagement, EngagementType, OrderType } from "@prisma/client";
import { useEffect, useState } from "react";
import fetchRequest from "../../lib/api/fetchRequest";
import {
  AnyOrder,
  CreateEngagement,
  DraftEngagementTemplatePayload,
  HomeOrder,
  PickupOrder,
} from "../../shared";

export type UseCreateEngagementParams =
  | { order: AnyOrder; customerIds?: number[] }
  | { order?: AnyOrder; customerIds: number[] };

const DEFAULT_PAYLOAD: DraftEngagementTemplatePayload = {
  textAbove: "",
  textBelow: "",
  url: "",
  imageFile: null,
  message: "",
};

export default function useCreateEngagement({ order, customerIds }: UseCreateEngagementParams) {
  if (!order && !customerIds) {
    throw new Error("Either 'order' or 'customerIds' must be provided.");
  }

  const [choice, setChoice] = useState<EngagementType>(EngagementType.QR_CODE);
  const [payload, setPayload] = useState<DraftEngagementTemplatePayload>(DEFAULT_PAYLOAD);

  const orderId = order?.id;
  const singleCustomerId =
    order?.type === OrderType.HOME
      ? (order as HomeOrder).home_order?.customer?.id
      : order?.type === OrderType.PICKUP
      ? (order as PickupOrder).pickup_order?.customer?.id
      : undefined;

  const targetCustomerIds = customerIds ?? (singleCustomerId ? [singleCustomerId] : []);

  const getEngagements = async () => {
    if (!singleCustomerId) return [];
    return await fetchRequest("GET", "/api/engagements/", "getEngagementsByCustomer", {
      customerId: singleCustomerId,
    });
  };

  const createEngagement = async (templateId: CreateEngagement["templateId"]) => {
    if (orderId) {
      return await fetchRequest<Engagement>("POST", "/api/engagements/", "createEngagement", {
        orderId,
        customerId:
          order.type === OrderType.HOME
            ? (order as HomeOrder).home_order?.customer?.id
            : order.type === OrderType.PICKUP
            ? (order as PickupOrder).pickup_order?.customer?.id
            : undefined,
        templateId,
      });
    } else {
      return await Promise.all(
        targetCustomerIds.map((customerId) =>
          fetchRequest<Engagement>("POST", "/api/engagements/", "createEngagement", {
            templateId,
            customerId,
          })
        )
      );
    }

    // setPayload(DEFAULT_PAYLOAD); // TTODO: this doesn't work well
  };

  const resetPayload = () => setPayload(DEFAULT_PAYLOAD);

  useEffect(() => {
    setPayload((prev) => ({
      ...prev,
      textAbove: prev.textAbove ?? "",
      textBelow: prev.textBelow ?? "",
      url: choice === EngagementType.QR_CODE ? "" : "",
      imageFile: choice === EngagementType.IMAGE ? null : null,
      message: choice === EngagementType.MESSAGE ? "" : "",
    }));
  }, [choice]);

  return {
    choice,
    setChoice,
    payload,
    setPayload,
    createEngagement,
    getEngagements,
    resetPayload,
  };
}
