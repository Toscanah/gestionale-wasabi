import { DateRange } from "react-day-picker";
import useRfmRules from "../rfm/useRfmRules";
import useRfmRanks from "../rfm/useRfmRanks";
import { useMemo, useState } from "react";
import { CustomerContracts, CustomerStatsSortField, CustomerWithStats } from "../../lib/shared";
import useQueryFilter from "../table/useQueryFilter";
import { SortField } from "../../components/ui/sorting/SortingMenu";
import { trpc } from "@/lib/server/client";
import { customersAPI } from "@/lib/server/api";
import { CustomerOrigin } from "@prisma/client";

const DEFAULT_DATE: DateRange = {
  from: undefined,
  to: undefined,
};

type UseCustomersStatsParams = {
  page: number;
  pageSize: number;
};

export const CUSTOMER_STATS_SORT_MAP: Record<string, CustomerStatsSortField> = {
  "Spesa totale": "totalSpent",
  "Ordine medio": "averageOrder",
  "Numero ordini": "totalOrders",
  "Primo ordine": "firstOrderAt",
  "Ultimo ordine": "lastOrderAt",
  "Punteggio RFM": "rfm.score.finalScore",
  "Rank RFM": "rfm.rank",
} as const;

export default function useCustomersStats({ page, pageSize }: UseCustomersStatsParams) {
  const { rfmRules } = useRfmRules();
  const { ranks: rfmRanks } = useRfmRanks();
  const ALL_RANKS = rfmRanks.map((r) => r.rank);

  const { debouncedQuery, inputQuery, setInputQuery } = useQueryFilter();
  const [activeSorts, setActiveSorts] = useState<SortField[]>([]);
  const [period, setPeriod] = useState<DateRange | undefined>(DEFAULT_DATE);
  const [ranks, setRanks] = useState<string[]>(ALL_RANKS);
  const [customerOrigins, setCustomerOrigins] = useState<CustomerOrigin[]>(
    Object.values(CustomerOrigin)
  );

  const rfmConfig = { ranks: rfmRanks, rules: rfmRules };

  const filters: NonNullable<CustomerContracts.ComputeStats.Input>["filters"] = useMemo(() => {
    let normalizedPeriod: { from: Date; to: Date } | undefined = undefined;
    if (period?.from) {
      normalizedPeriod = {
        from: period.from,
        to: period.to ?? period.from,
      };
    }

    const originsFilter =
      customerOrigins.length === Object.values(CustomerOrigin).length ? undefined : customerOrigins;
    const ranksFilter = ranks.length === rfmRanks.length ? undefined : ranks;
    const search = debouncedQuery && debouncedQuery.trim() !== "" ? debouncedQuery : undefined;

    // If all filters are undefined, return undefined
    if (!normalizedPeriod && !ranksFilter && !search && !originsFilter) {
      return undefined;
    }

    return {
      period: normalizedPeriod,
      ranks: ranksFilter,
      query: search,
      customerOrigins: originsFilter,
    };
  }, [period, ranks, debouncedQuery, customerOrigins]);

  const sorting = useMemo(() => {
    return activeSorts.map((s) => ({
      field: CUSTOMER_STATS_SORT_MAP[s.field as CustomerStatsSortField],
      direction: s.direction,
    }));
  }, [activeSorts]);

  const baseQuery = customersAPI.getAllComprehensive.useQuery(undefined, {
    placeholderData: (prev) => prev,
  });

  const baseMap = useMemo(
    () => new Map(baseQuery.data?.customers.map((c) => [c.id, c]) ?? []),
    [baseQuery.data]
  );

  const computeQuery = customersAPI.computeStats.useQuery(
    {
      filters,
      pagination:
        pageSize !== null && !isNaN(pageSize) && pageSize > 0
          ? {
              page,
              pageSize,
            }
          : undefined,
      sort: sorting.length > 0 ? sorting : undefined,
      rfmConfig,
    },
    {
      enabled: baseQuery.isSuccess && !!baseQuery.data?.customers,
      placeholderData: (prev) => prev,
      select: (data) => {
        if (!baseQuery.data) return { customers: [], totalCount: 0 };

        return {
          totalCount: data.totalCount,
          customers: data.customersStats
            .map((s) => {
              const base = baseMap.get(s.customerId);
              if (!base) return null;

              // attach stats without cloning base
              return Object.assign({}, base, { stats: s });
            })
            .filter(Boolean) as CustomerWithStats[],
        };
      },
    }
  );

  const handleReset = () => {
    setRanks(ALL_RANKS);
    setPeriod(DEFAULT_DATE);
    setInputQuery("");
  };

  return {
    customers: computeQuery.data?.customers ?? [],
    totalCount: computeQuery.data?.totalCount ?? 0,
    isLoading:
      computeQuery.isLoading ||
      computeQuery.isFetching ||
      baseQuery.isLoading ||
      baseQuery.isFetching,
    period,
    ranks,
    setRanks,
    setPeriod,
    customerOrigins,
    setCustomerOrigins,
    debouncedQuery,
    inputQuery,
    setInputQuery,
    handleReset,
    allRanks: ALL_RANKS,
    rfmRanks,
    sortingFields: CUSTOMER_STATS_SORT_MAP,
    activeSorts,
    setActiveSorts,
  };
}
