import { EngagementType, OrderType } from "@prisma/client";
import { useState } from "react";
import fetchRequest from "../../lib/api/fetchRequest";
import { AnyOrder, EngagementPayload, HomeOrder, PickupOrder } from "../../shared";

export type UseCreateEngagementParams =
  | { order: AnyOrder; customerIds?: number[] }
  | { order?: AnyOrder; customerIds: number[] };

export default function useCreateEngagement({ order, customerIds }: UseCreateEngagementParams) {
  if (!order && !customerIds) {
    throw new Error("Either 'order' or 'customerIds' must be provided.");
  }

  const [choice, setChoice] = useState<EngagementType>(EngagementType.QR_CODE);
  const [textAbove, setTextAbove] = useState<string>("");
  const [textBelow, setTextBelow] = useState<string>("");

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

  const createEngagement = async (payload: EngagementPayload) => {
    if (orderId) {
      return await fetchRequest("POST", "/api/engagements/", "createEngagement", {
        orderId,
        customerId:
          order.type === OrderType.HOME
            ? (order as HomeOrder).home_order?.customer?.id
            : order.type === OrderType.PICKUP
            ? (order as PickupOrder).pickup_order?.customer?.id
            : undefined,
        payload,
        type: choice,
      });
    } else {
      return await Promise.all(
        targetCustomerIds.map((customerId) =>
          fetchRequest("POST", "/api/engagements/", "createEngagement", {
            payload,
            type: choice,
            customerId,
          })
        )
      );
    }
  };

  return {
    choice,
    setChoice,
    textAbove,
    setTextAbove,
    textBelow,
    setTextBelow,
    createEngagement,
    getEngagements,
  };
}
