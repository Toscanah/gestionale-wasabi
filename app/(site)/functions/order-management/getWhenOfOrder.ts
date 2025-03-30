import { OrderType } from "@prisma/client";
import { AnyOrder, HomeOrder, PickupOrder } from "../../models";

export default function getWhenOfOrder(order: AnyOrder): { when: string } {
  let when = "immediate";

  if (order.type == OrderType.HOME) {
    when = (order as HomeOrder).home_order?.when ?? "immediate";
  } else {
    when = (order as PickupOrder).pickup_order?.when ?? "immediate";
  }

  return { when };
}
