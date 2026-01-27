import { MAX_RECORDS, ProductContracts } from "@/lib/shared";
import prisma from "../prisma";
import { categoryInclude } from "../includes";
import sorterFactory from "@/lib/shared/utils/global/sorting/sorterFactory";
import { KitchenType } from "@/prisma/generated/client/enums";
import { KITCHEN_TYPE_LABELS } from "@/lib/shared/constants/kitchen-type-labels";
import { Prisma } from "@/prisma/generated/client/client";

export default async function getProducts(
  input: ProductContracts.GetAll.Input
): Promise<ProductContracts.GetAll.Output> {
  const filters = input?.filters;
  const pagination = input?.pagination;
  const sort = input?.sort;

  const where: Prisma.ProductWhereInput = {};

  if (filters?.categoryIds && filters.categoryIds.length > 0) {
    const hasNoCategory = filters.categoryIds.includes(-1);
    const validIds = filters.categoryIds.filter((id) => id !== -1);

    if (hasNoCategory && validIds.length > 0) {
      // Match products that either have no category or one of the selected ones
      where.OR = [{ category_id: { in: validIds } }, { category_id: null }];
    } else if (hasNoCategory) {
      // Only products without a category
      where.category_id = null;
    } else {
      // Normal category filter
      where.category_id = { in: validIds };
    }
  }

  if (typeof filters?.onlyActive === "boolean") {
    where.active = filters.onlyActive;
  }

  if (filters?.query?.trim()) {
    const q = filters.query.trim();
    const qLower = q.toLowerCase();

    const matchedKitchenEnums = Object.entries(KITCHEN_TYPE_LABELS)
      .filter(([_, label]) => label.toLowerCase().includes(qLower))
      .map(([enumKey]) => enumKey as KitchenType);

    const hasKitchenMatch = matchedKitchenEnums.length > 0;

    where.OR = [
      { code: { contains: q, mode: "insensitive" } },
      { desc: { contains: q, mode: "insensitive" } },
      { home_price: { equals: Number(q) || undefined } },
      { site_price: { equals: Number(q) || undefined } },
      { rice: { equals: Number(q) || undefined } },
      { kitchen: hasKitchenMatch ? { in: matchedKitchenEnums } : undefined },
      {
        category: {
          category: { contains: q, mode: "insensitive" },
        },
      },
    ];
  }

  const take = pagination?.pageSize ?? MAX_RECORDS;
  const skip = pagination?.page ? pagination.page * take : 0;

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
