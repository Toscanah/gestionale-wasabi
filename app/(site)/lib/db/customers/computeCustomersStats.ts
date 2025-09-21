import calculateRfmRank from "../../services/rfm/calculateRfmRank";
import calculateRfmScore from "../../services/rfm/calculateRfmScore";
import normalizePeriod from "../../utils/global/date/normalizePeriod";
import prisma from "../db";
import { getCustomersStats } from "@prisma/client/sql";
import countCustomers from "./util/countCustomers";
import { CustomerContracts, CustomerStats, SortDirection } from "../../shared";
import { GetCustomersStats } from "../../shared/schemas/results/getCustomersStats.schema";
import { endOfDay, startOfDay } from "date-fns";
import { Comparator } from "../../utils/global/sorting/defaultComparator";
import sorterFactory from "../../utils/global/sorting/sorterFactory";
import { MAX_RECORDS } from "../../shared/constants/max-records";

export default async function computeCustomersStats(
  input: CustomerContracts.ComputeStats.Input
): Promise<CustomerContracts.ComputeStats.Output> {
  const { rfmConfig, filters, pagination, sort } = input ?? {};
  const { period, ranks, query } = filters || {};
  const normalizedPeriod = normalizePeriod(period);

  let needsNodeSideProcessing = false;

  // if we have sorting or rank filtering, we need to do it on the Node.js side
  if (sort?.length) {
    needsNodeSideProcessing = true;
  }
  if (ranks?.length) {
    needsNodeSideProcessing = true;
  }

  let page = 0;
  let pageSize = MAX_RECORDS;

  // Case 1: DB-side pagination
  if (pagination && !needsNodeSideProcessing) {
    page = pagination.page;
    pageSize = pagination.pageSize;
  }

  // Case 2: Node-side pagination
  if (pagination && needsNodeSideProcessing) {
    page = pagination.page;
    pageSize = pagination.pageSize;
  }

  const offset = page * pageSize;
  const limit = pageSize;

  const customersStatsBase: GetCustomersStats[] = await prisma.$queryRawTyped(
    getCustomersStats(
      normalizedPeriod?.from ? startOfDay(new Date(normalizedPeriod.from)) : null,
      normalizedPeriod?.to ? endOfDay(new Date(normalizedPeriod.to)) : null,
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

  const rankPriorityMap: Map<string, number> = new Map<string, number>(
    rfmConfig.ranks.map((r) => [r.rank, r.priority])
  );

  const rankComparator: Comparator<CustomerStats> = (
    a: CustomerStats,
    b: CustomerStats,
    direction: SortDirection
  ) => {
    const aP: number = rankPriorityMap.get(a.rfm.rank) ?? -Infinity;
    const bP: number = rankPriorityMap.get(b.rfm.rank) ?? -Infinity;
    if (aP === bP) return 0;
    return direction === "asc" ? aP - bP : bP - aP;
  };

  if (sort?.length) {
    sorted = [...filtered].sort(
      sorterFactory(sort, {
        "rfm.rank": rankComparator,
      })
    );
  }

  const paginated = needsNodeSideProcessing
    ? sorted.slice(page * pageSize, (page + 1) * pageSize)
    : sorted;

  let totalCount: number;

  if (needsNodeSideProcessing) {
    totalCount = filtered.length;
  } else {
    totalCount = await countCustomers({ query });
  }

  return {
    customersStats: paginated,
    totalCount,
  };
}
