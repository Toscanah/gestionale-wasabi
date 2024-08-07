import { ProductWithInfo } from "../../types/ProductWithInfo";
import prisma from "../db";

export default async function getProducts(): Promise<ProductWithInfo[]> {
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
