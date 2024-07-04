import { TypesOfOrder } from "../../types/TypesOfOrder";
import prisma from "../db";

export default async function getOrdersByType(type: TypesOfOrder) {
  return await prisma.order.findMany({
    include: {
      products: {
        include: {
          product: true,
        },
      },
      customer: true,
      table: true,
      address: true,
    },
    where: {
      type: type,
    },
  });
}
