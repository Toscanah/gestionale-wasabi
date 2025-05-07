import { AnyOrder } from "@shared";
import prisma from "../db";
import { engagementsInclude, homeOrderInclude, pickupOrderInclude, productInOrderInclude } from "../includes";

export default async function getOrderById({
  orderId,
  variant = "onlyPaid",
}: {
  orderId: number;
  variant?: string;
}): Promise<AnyOrder> {
  const existingOrder = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
    include: {
      products: {
        ...(variant !== "onlyPaid"
          ? {}
          : {
              where: {
                is_paid_fully: false,
              },
            }),
        include: {
          ...productInOrderInclude,
        },
      },
      payments: true,
      ...homeOrderInclude,
      ...pickupOrderInclude,
      table_order: true,
     ...engagementsInclude,
    },
  });

  if (!existingOrder) {
    throw new Error(`Order with id ${orderId} not found`);
  }

  return existingOrder;
}
