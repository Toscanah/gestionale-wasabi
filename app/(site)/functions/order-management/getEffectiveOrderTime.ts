import { AnyOrder } from "../../models";
import timeToDecimal from "../util/timeToDecimal";
import getWhenOfOrder from "./getWhenOfOrder";

export default function getEffectiveOrderTime(order: AnyOrder): { time: number } {
  const { when } = getWhenOfOrder(order);

  const date =
    when.toLowerCase() !== "immediate"
      ? new Date(`1970-01-01T${when}`)
      : new Date(order.created_at);

  const time = timeToDecimal(date);
  return { time };
}
