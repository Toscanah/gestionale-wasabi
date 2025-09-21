import { DateRange } from "react-day-picker";
import useRfmRules from "../rfm/useRfmRules";
import useRfmRanks from "../rfm/useRfmRanks";
import { useMemo, useState } from "react";
import { CustomerContracts, CustomerStatsSortField, CustomerWithStats } from "../../lib/shared";
import useQueryFilter from "../table/useGlobalFilter";
import { SortField } from "../../components/ui/sorting/SortingMenu";
import { trpc } from "@/lib/server/client";
import { customersAPI } from "@/lib/server/api";

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
  "Ultimo ordine": "lastOrderAt",
  "Numero ordini": "totalOrders",
  "Primo ordine": "firstOrderAt",
  "Punteggio RFM": "rfm.score.finalScore",
  "Rank RFM": "rfm.rank",
  "Ordine medio": "averageOrder",
} as const;

export default function useCustomersStats({ page, pageSize }: UseCustomersStatsParams) {
  const { rfmRules } = useRfmRules();
  const { ranks: rfmRanks } = useRfmRanks();
  const ALL_RANKS = rfmRanks.map((r) => r.rank);

  const { debouncedQuery, inputQuery, setInputQuery } = useQueryFilter();
  const [activeSorts, setActiveSorts] = useState<SortField[]>([]);
  const [period, setPeriod] = useState<DateRange | undefined>(DEFAULT_DATE);
  const [ranks, setRanks] = useState<string[]>(ALL_RANKS);

  const rfmConfig = { ranks: rfmRanks, rules: rfmRules };

  const filters: NonNullable<CustomerContracts.ComputeStats.Input>["filters"] = useMemo(() => {
    let normalizedPeriod: { from: Date; to: Date } | undefined = undefined;
    if (period?.from) {
      normalizedPeriod = {
        from: period.from,
        to: period.to ?? period.from,
      };
    }

    const ranksFilter = ranks.length === rfmRanks.length ? undefined : ranks;

    const search = debouncedQuery && debouncedQuery.trim() !== "" ? debouncedQuery : undefined;

    return {
      period: normalizedPeriod,
      ranks: ranksFilter,
      query: search,
    };
  }, [period, ranks, debouncedQuery]);

  const sorting = useMemo(() => {
    return activeSorts.map((s) => ({
      field: CUSTOMER_STATS_SORT_MAP[s.field as CustomerStatsSortField],
      direction: s.direction,
    }));
  }, [activeSorts]);

  const { data: baseCustomers } = customersAPI.getAllWithDetails.useQuery();

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
      sort: sorting,
      rfmConfig,
    },
    {
      enabled: !!baseCustomers,
      placeholderData: (prev) => prev,
      select: (data) => {
        if (!baseCustomers) return { customers: [] as CustomerWithStats[], totalCount: 0 };

        const baseMap = new Map(baseCustomers.map((c) => [c.id, c]));

        return {
          totalCount: data.totalCount,
          customers: data.customersStats
            .flatMap((s) => {
              const { customerId, ...stats } = s;
              const base = baseMap.get(customerId);
              if (!base) return null;

              return { ...base, stats };
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
    isLoading: computeQuery.isLoading || computeQuery.isFetching,
    period,
    ranks,
    setRanks,
    setPeriod,
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
