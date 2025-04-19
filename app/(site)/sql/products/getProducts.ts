import { Product } from "@shared"
;
import prisma from "../db";
import { categoryInclude } from "../includes";

export default async function getProducts(): Promise<Product[]> {
  return await prisma.product.findMany({
    include: {
      ...categoryInclude,
    },
  });
}
