import { DateRange } from "react-day-picker";
import useRfmRules from "../rfm/useRfmRules";
import useRfmRanks from "../rfm/useRfmRanks";
import { useMemo, useState } from "react";
import { CustomerContracts, CustomerStatsSortField, CustomerWithStats } from "@/lib/shared";
import useQueryFilter from "../table/useQueryFilter";
// import { SortableField, SortField } from "@/components/ui/sorting/SortingMenu";
import { SortableField, SortField } from "@/components/shared/sorting/SortingMenu";
import { trpc } from "@/lib/trpc/client";
import { customersAPI } from "@/lib/trpc/api";
import { CustomerOrigin } from "@/prisma/generated/client/enums";

const DEFAULT_DATE: DateRange = {
  from: undefined,
  to: undefined,
};

type UseCustomersStatsParams = {
  page: number;
  pageSize: number;
};

export const CUSTOMER_STATS_SORT_MAP: Record<
  string,
  { field: CustomerStatsSortField; type?: SortableField["type"] }
> = {
  "Spesa totale": { field: "totalSpent", type: "number" },
  "Ordine medio": { field: "averageOrder", type: "number" },
  "Numero ordini": { field: "totalOrders", type: "number" },
  "Primo ordine": { field: "firstOrderAt", type: "date" },
  "Ultimo ordine": { field: "lastOrderAt", type: "date" },
  "Punteggio RFM": { field: "rfm.score.finalScore", type: "number" },
  "Rank RFM": { field: "rfm.rank", type: "number" },
} as const;

export default function useCustomersStats({ page, pageSize }: UseCustomersStatsParams) {
  const { rfmRules } = useRfmRules();
  const { ranks: rfmRanks } = useRfmRanks();
  const ALL_RANKS = rfmRanks.map((r) => r.rank);

  const { debouncedQuery, inputQuery, setInputQuery, resetQuery } = useQueryFilter();
  const [activeSorts, setActiveSorts] = useState<SortField[]>([]);
  const [period, setPeriod] = useState<DateRange | undefined>(DEFAULT_DATE);
  const [ranks, setRanks] = useState<string[]>(ALL_RANKS);
  const [customerOrigins, setCustomerOrigins] = useState<CustomerOrigin[]>(
    Object.values(CustomerOrigin),
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
      field: CUSTOMER_STATS_SORT_MAP[s.field as CustomerStatsSortField].field,
      direction: s.direction,
    }));
  }, [activeSorts]);

  const baseQuery = customersAPI.getAllComprehensive.useQuery(undefined, {
    placeholderData: (prev) => prev,
  });

  const baseMap = useMemo(
    () => new Map(baseQuery.data?.customers.map((c) => [c.id, c]) ?? []),
    [baseQuery.data],
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
    },
  );

  const handleReset = () => {
    setRanks(ALL_RANKS);
    setPeriod(DEFAULT_DATE);
    setInputQuery("");
    setActiveSorts([]);
    setCustomerOrigins(Object.values(CustomerOrigin));
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
    rfmRules,
    resetQuery,
  };
}
