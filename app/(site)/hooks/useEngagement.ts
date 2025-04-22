import { EngagementType, OrderType } from "@prisma/client";
import { useState } from "react";
import fetchRequest from "../lib/api/fetchRequest";
import { AnyOrder, CreateEngagement, HomeOrder, PickupOrder } from "../shared";

type UseEngagementParams =
  | { order: AnyOrder; customerIds?: never }
  | { order?: never; customerIds: number[] };

export default function useEngagement({ order, customerIds }: UseEngagementParams) {
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

  const createEngagement = async (payload: CreateEngagement["payload"]) => {
    const results = await Promise.all(
      targetCustomerIds.map((customerId) =>
        fetchRequest("POST", "/api/engagements/", "createEngagement", {
          type: choice,
          payload,
          customerId,
          ...(orderId ? { orderId } : {}),
        })
      )
    );

    return results;
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
