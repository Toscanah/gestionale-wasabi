import { getOrderTotal } from "../../lib/services/order-management/getOrderTotal";
import capitalizeFirstLetter from "../../lib/utils/global/string/capitalizeFirstLetter";

export const formatDateWithDay = (dateString: Date) => {
  const formattedDate = new Intl.DateTimeFormat("it-IT", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(dateString));

  return capitalizeFirstLetter(formattedDate);
};

export const sortOrdersByDateDesc = (a: any, b: any) =>
  new Date(b.order.created_at).getTime() - new Date(a.order.created_at).getTime();

export const formatOrderTotal = (order: any) =>
  `€ ${getOrderTotal({ order, applyDiscount: true })}${
    order.discount !== 0 ? ` (sconto ${order.discount}%)` : ""
  }`;