import { MAX_RECORDS, ProductContracts } from "@/app/(site)/lib/shared";
import prisma from "../db";
import { categoryInclude } from "../includes";
import sorterFactory from "../../utils/global/sorting/sorterFactory";
import { Prisma } from "@prisma/client";

export default async function getProducts(
  input: ProductContracts.GetAll.Input
): Promise<ProductContracts.GetAll.Output> {
  const filters = input?.filters;
  const pagination = input?.pagination;
  const sort = input?.sort;

  const where: Prisma.ProductWhereInput = {};

  if (filters?.categoryIds && filters.categoryIds.length > 0 && !filters.categoryIds.includes(-1)) {
    where.category_id = { in: filters.categoryIds };
  }

  if (typeof filters?.onlyActive === "boolean") {
    where.active = filters.onlyActive;
  }

  const take = pagination?.pageSize ?? MAX_RECORDS;
  const skip = pagination?.page ? (pagination.page - 1) * take : 0;

  const filtered = await prisma.product.findMany({
    where,
    include: categoryInclude,
  });

  let sorted = filtered;
  if (sort?.length) {
    sorted = [...filtered].sort(sorterFactory(sort));
  }

  const paginated = pagination ? sorted.slice(skip, skip + take) : sorted;

  const totalCount = await prisma.product.count({ where });

  return { products: paginated, totalCount };
}
