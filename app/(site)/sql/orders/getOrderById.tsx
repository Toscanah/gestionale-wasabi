import { AnyOrder } from "../../types/PrismaOrders";
import prisma from "../db";

export default async function getOrderById(orderId: number): Promise<AnyOrder> {
  return (await prisma.order.findUnique({
    where: {
      id: orderId,
    },
    include: {
      products: {
        where: {
          is_paid_fully: false,
        },
        include: {
          product: {
            include: {
              category: {
                include: {
                  options: {
                    include: {
                      option: true,
                    },
                  },
                },
              },
            },
          },
          options: { include: { option: true } },
        },
      },
      payments: true,
      home_order: {
        include: { address: true, customer: { include: { phone: true } } },
      },
      pickup_order: {
        include: { customer: { include: { phone: true } } },
      },
      table_order: true,
    },
  })) as AnyOrder;
}
