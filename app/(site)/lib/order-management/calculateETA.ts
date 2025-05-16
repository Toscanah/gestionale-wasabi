import { OrderType } from "@prisma/client";
import { AnyOrder, HomeOrder, PickupOrder, Riders } from "../../shared";

type CalculateETAParams = {
  riders: Riders;
  order: HomeOrder;
  homeOrders: HomeOrder[];
};

function getEarliestArrival(order: HomeOrder): Date {
  const EARLIEST_ARRIVAL_MINUTES = 35;
  const earliestArrival = new Date(
    new Date(order.created_at).getTime() + EARLIEST_ARRIVAL_MINUTES * 60 * 1000
  );

  if (!order.home_order) throw new Error("Home order not defined");
  if (order.home_order.when === "immediate") return earliestArrival;

  const scheduled = new Date(`1970-01-01T${order.home_order.when}:00`);
  return scheduled < earliestArrival ? earliestArrival : scheduled;
}

function getArrivalWindow(order: HomeOrder, avgPerHour: number): { depart: Date; return: Date } {
  const arrival = getEarliestArrival(order);
  const AVERAGE_ORDER_MINUTES = 60 / avgPerHour;
  const HALF_CYCLE_MS = (AVERAGE_ORDER_MINUTES / 2) * 60 * 1000;

  return {
    depart: new Date(arrival.getTime() - HALF_CYCLE_MS),
    return: new Date(arrival.getTime() + HALF_CYCLE_MS),
  };
}

export default function calculateETA({ riders, order, homeOrders }: CalculateETAParams) {
  const { count: riderCount, avgPerHour } = riders;
  const MAX_ORDERS_PER_HOUR = riderCount * avgPerHour;
  const AVERAGE_ORDER_MINUTES = 60 / avgPerHour;
  const HALF_CYCLE_MS = (AVERAGE_ORDER_MINUTES / 2) * 60 * 1000;

  let candidateArrival = getEarliestArrival(order);

  while (true) {
    const candidateDeparture = new Date(candidateArrival.getTime() - HALF_CYCLE_MS);
    const candidateReturn = new Date(candidateArrival.getTime() + HALF_CYCLE_MS);

    const overlappingOrders = homeOrders
      .filter((o) => o.id !== order.id)
      .map((o) => getArrivalWindow(o, avgPerHour))
      .filter(({ depart, return: r }) => r > candidateDeparture && depart < candidateReturn);

    if (overlappingOrders.length < MAX_ORDERS_PER_HOUR) {
      return {
        estimatedArrival: candidateArrival,
        estimatedDeparture: candidateDeparture,
        estimatedReturn: candidateReturn,
      };
    }

    // Shift by 1 minute and try again
    candidateArrival = new Date(candidateArrival.getTime() + 60 * 1000);
  }
}
