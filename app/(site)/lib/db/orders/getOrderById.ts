import { AnyOrder } from "@/app/(site)/lib/shared";
import prisma from "../db";
import {
  engagementsInclude,
  homeOrderInclude,
  pickupOrderInclude,
  productInOrderInclude,
} from "../includes";
import normalizeTemplatePayload from "../../formatting-parsing/engagement/normalizeTemplatePayload";

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

  // Filter products manually if needed
  const filteredProducts =
    variant === "onlyPaid"
      ? existingOrder.products.filter((p) => (p.paid_quantity ?? 0) < p.quantity)
      : existingOrder.products;

  return {
    ...existingOrder,
    products: filteredProducts,
    // engagements: existingOrder.engagements.map((e) => ({
    //   ...e,
    //   template: normalizeTemplatePayload(e.template),
    // })),
  };
}
