import { OrderType } from "../../types/OrderType";
import prisma from "./../db";

export default async function getOrders() {
  return await prisma.order.findMany({
    include: {
      products: {
        include: {
          product: true
        }
      },
      customer: true,
      table: true,
      address: true,
    },
  });
}
