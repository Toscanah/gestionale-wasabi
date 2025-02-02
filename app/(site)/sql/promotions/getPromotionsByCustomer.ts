import { Promotion } from "../../models";
import prisma from "../db";

export default async function getPromotionsByCustomer(customerId: number): Promise<Promotion[]> {
  return prisma.promotion.findMany({
    where: {
      customer_id: customerId,
    },
    include: {
      extra_product: {
        include: {
          category: {
            include: {
              options: {
                include: { option: true },
              },
            },
          },
        },
      },
    },
  });
}
