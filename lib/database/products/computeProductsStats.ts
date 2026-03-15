import prisma from "../prisma";
import { endOfDay, startOfDay } from "date-fns";
import normalizePeriod from "@/lib/shared/utils/global/date/normalizePeriod";
import { ProductContracts, ProductStatsOnlySchema, ShiftFilterValue } from "@/lib/shared";
import sorterFactory from "@/lib/shared/utils/global/sorting/sorterFactory";
import { getProductsStats } from "@/prisma/generated/client/sql";

export default async function computeProductsStats(
  input: ProductContracts.ComputeStats.Input
): Promise<ProductContracts.ComputeStats.Output> {
  const { filters, sort } = input ?? {};

  const { categoryIds, period, shift, query } = filters || {};
  const normalizedPeriod = normalizePeriod(period);

  const categoriesStr = categoryIds && categoryIds.length > 0 ? categoryIds.join(",") : null;
  const productsStats = await prisma.$queryRawTyped(
    getProductsStats(
      normalizedPeriod?.from ? startOfDay(new Date(normalizedPeriod.from)) : null,
      normalizedPeriod?.to ? endOfDay(new Date(normalizedPeriod.to)) : null,
      categoriesStr ?? null,
      shift && shift !== ShiftFilterValue.ALL ? shift : null,
      query ?? null
    )
  );

  let sorted = productsStats;
  if (sort?.length) {
    sorted = [...sorted].sort(sorterFactory(sort));
  }

  return {
    productsStats: sorted.map((ps) => {
      return {
        options: ps.options ? ProductStatsOnlySchema.shape.options.parse(ps.options) : [],
        productId: ps.productId,
        unitsSold: ps.unitsSold ?? 0,
        totalRice: ps.totalRice ?? 0,
        revenue: ps.revenue ?? 0,
        hasTopCustomers: ps.hasTopCustomers ?? false,
      };
    }),
  };
}
