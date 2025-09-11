import calculateRfmRank from "../../services/rfm/calculateRfmRank";
import calculateRfmScore from "../../services/rfm/calculateRfmScore";
import { CustomerContract, CustomerStats, GetCustomerStatsReturn } from "../../shared";
import normalizePeriod from "../../utils/global/date/normalizePeriod";
import getNestedValue from "../../utils/global/getNestedValue";
import prisma from "../db";
import { getCustomersStats } from "@prisma/client/sql";
import countCustomers from "./util/countCustomers";

/**
 * Computes customer statistics based on provided filters, RFM (Recency, Frequency, Monetary) configuration,
 * pagination, and sorting options.
 *
 * This function retrieves customer statistics from the database, enriches them with RFM scores and ranks,
 * applies optional filtering by ranks, sorts the results according to the specified criteria, and paginates
 * the final output. If sorting or rank filtering is requested, processing is performed on the Node.js side.
 *
 * @param params - The parameters for computing customer statistics.
 * @param params.rfmConfig - The RFM configuration, including rules and rank definitions.
 * @param params.filters - Optional filters to apply, such as period, ranks, and query string.
 * @param params.page - The page number for pagination (default is 0).
 * @param params.pageSize - The number of items per page.
 * @param params.sort - Optional sorting criteria, as an array of field/direction pairs.
 * @returns A promise that resolves to an object containing the paginated, filtered, and sorted customer statistics,
 *          along with the total count of matching customers.
 */
export default async function computeCustomersStats({
  rfmConfig,
  filters,
  page = 0,
  pageSize,
  sort,
}: CustomerContract["Requests"]["ComputeCustomersStats"]): Promise<
  CustomerContract["Responses"]["ComputeCustomersStats"]
> {
  const { period, ranks, query } = filters || {};
  const normalizedPeriod = normalizePeriod(period);

  const needsNodeSideProcessing = !!(sort?.length || ranks?.length);
  const offset = needsNodeSideProcessing ? 0 : page * (pageSize ?? 0);
  const limit = needsNodeSideProcessing
    ? 2147483647 // effectively "no limit"
    : pageSize ?? 20;

  const customersStatsBase: GetCustomerStatsReturn[] = await prisma.$queryRawTyped(
    getCustomersStats(
      normalizedPeriod?.from ? new Date(normalizedPeriod.from) : null,
      normalizedPeriod?.to ? new Date(normalizedPeriod.to) : null,
      query ?? null,
      offset,
      limit
    )
  );

  const customersStatsEnriched: CustomerStats[] = customersStatsBase.map((c) => {
    const {
      recency,
      frequency,
      monetary,
      averageOrder,
      customerId,
      firstOrderAt,
      lastOrderAt,
      totalOrders,
      totalSpent,
    } = c;

    const rfmScore = calculateRfmScore(
      { recency: recency ?? 0, frequency: frequency ?? 0, monetary: monetary ?? 0 },
      rfmConfig.rules
    );
    const rank = calculateRfmRank(rfmScore, rfmConfig.ranks) ?? "";

    return {
      averageOrder: averageOrder ?? 0,
      customerId,
      firstOrderAt: firstOrderAt ?? null,
      lastOrderAt: lastOrderAt ?? null,
      totalOrders: totalOrders ?? 0,
      totalSpent: totalSpent ?? 0,
      rfm: {
        score: {
          ...rfmScore,
        },
        rank,
      },
    };
  });

  let filtered = customersStatsEnriched;
  if (ranks?.length) {
    filtered = filtered.filter((c) => ranks.includes(c.rfm.rank));
  }

  let sorted = filtered;
  if (sort?.length) {
    // build rank → priority map once
    const rankPriorityMap = new Map(rfmConfig.ranks.map((r) => [r.rank, r.priority]));

    sorted = [...filtered].sort((a, b) => {
      for (const { field, direction } of sort) {
        const aVal = getNestedValue(a, field);
        const bVal = getNestedValue(b, field);

        if (aVal == null && bVal == null) continue;
        if (aVal == null) return 1;
        if (bVal == null) return -1;

        // --- special handling for rank field ---
        if (field === "rfm.rank") {
          const aP = rankPriorityMap.get(aVal) ?? -Infinity;
          const bP = rankPriorityMap.get(bVal) ?? -Infinity;
          if (aP !== bP) {
            return direction === "asc" ? aP - bP : bP - aP;
          }
          continue;
        }

        // --- numbers ---
        if (typeof aVal === "number" && typeof bVal === "number") {
          if (aVal !== bVal) return direction === "asc" ? aVal - bVal : bVal - aVal;
          continue;
        }

        // --- dates ---
        if (aVal instanceof Date && bVal instanceof Date) {
          if (aVal.getTime() !== bVal.getTime())
            return direction === "asc"
              ? aVal.getTime() - bVal.getTime()
              : bVal.getTime() - aVal.getTime();
          continue;
        }

        // --- fallback string comparison ---
        const cmp = String(aVal).localeCompare(String(bVal));
        if (cmp !== 0) return direction === "asc" ? cmp : -cmp;
      }
      return 0;
    });
  }

  const paginated = needsNodeSideProcessing
    ? sorted.slice(page * pageSize, (page + 1) * pageSize)
    : sorted;

  let totalCount: number;

  if (needsNodeSideProcessing) {
    totalCount = filtered.length; // after rank filtering
  } else {
    totalCount = await countCustomers({ query });
  }

  return {
    customersStats: paginated,
    totalCount,
  };
}
