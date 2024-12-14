import { Product } from "@/app/(site)/models";
import prisma from "../db";

export default async function getProducts(): Promise<Product[]> {
  return await prisma.product.findMany({
    include: {
      category: {
        include: {
          options: {
            select: {
              option: true,
            },
          },
        },
      },
    },
  });
}
