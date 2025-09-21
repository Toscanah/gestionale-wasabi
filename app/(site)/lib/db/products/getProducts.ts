import { ProductContracts } from "@/app/(site)/lib/shared";
import prisma from "../db";
import { categoryInclude } from "../includes";

export default async function getProducts(
  input: ProductContracts.GetAll.Input
): Promise<ProductContracts.GetAll.Output> {
  return await prisma.product.findMany({
    include: {
      ...categoryInclude,
    },
  });
}
