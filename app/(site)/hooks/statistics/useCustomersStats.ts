import { DateRange } from "react-day-picker";
import { useQuery } from "@tanstack/react-query";
import fetchRequest from "@/app/(site)/lib/api/fetchRequest";
import useRfmRules from "../rfm/useRfmRules";
import useRfmRanks from "../rfm/useRfmRanks";
import { useMemo, useState } from "react";
import {
  CustomerContract,
  CustomerStatsSortField,
  CustomerWithDetails,
  CustomerWithStats,
} from "../../lib/shared";
import useQueryFilter from "../table/useGlobalFilter";
import { SortField } from "../../components/ui/sorting/SortingMenu";

const DEFAULT_DATE: DateRange = {
  from: undefined,
  to: undefined,
};

type UseCustomersStatsParams = {
  page: number;
  pageSize: number;
};

export const CUSTOMER_STATS_SORT_MAP: Record<string, CustomerStatsSortField> = {
  "Spesa totale": "total_spent",
  "Ultimo ordine": "last_order_at",
  "Numero ordini": "total_orders",
  "Primo ordine": "first_order_at",
  "Punteggio RFM": "rfm.score.finalScore",
  "Rank RFM": "rfm.rank",
} as const;

export default function useCustomersStats({ page, pageSize }: UseCustomersStatsParams) {
  const { rfmRules } = useRfmRules();
  const { ranks: rfmRanks } = useRfmRanks();
  const ALL_RANKS = rfmRanks.map((r) => r.rank);

  const { debouncedQuery, inputQuery, setInputQuery } = useQueryFilter();
  const [activeSorts, setActiveSorts] = useState<SortField[]>([
    // { field: "Spesa totale", direction: "asc", index: 0 },
  ]);
  const [period, setPeriod] = useState<DateRange | undefined>(DEFAULT_DATE);
  const [ranks, setRanks] = useState<string[]>(ALL_RANKS);

  const rfmConfig = { ranks: rfmRanks, rules: rfmRules };

  const filters: CustomerContract["Requests"]["ComputeCustomersStats"]["filters"] = useMemo(() => {
    // Normalize period
    let normalizedPeriod: { from: Date; to: Date } | undefined = undefined;
    if (period?.from) {
      normalizedPeriod = {
        from: period.from,
        to: period.to ?? period.from, // if only "from" → use same for "to"
      };
    }

    // Rank: treat "all" as undefined (so it doesn't filter)
    const ranksFilter = ranks.length === rfmRanks.length ? undefined : ranks;

    // Search query
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

  const { data: baseCustomers } = useQuery({
    queryKey: ["baseCustomers"],
    queryFn: () =>
      fetchRequest<CustomerWithDetails[]>("GET", "/api/customers", "getCustomersWithDetails", {}),
    staleTime: Infinity,
  });

  const query = useQuery({
    queryKey: ["customers", { page, pageSize, filters, sorting }],
    queryFn: async () =>
      await fetchRequest<CustomerContract["Responses"]["ComputeCustomersStats"]>(
        "PATCH",
        "/api/customers",
        "computeCustomersStats",
        {
          filters,
          page,
          pageSize,
          sort: sorting,
          rfmConfig,
        }
      ),
    placeholderData: (prev) => prev,
    select: (data) => {
      if (!baseCustomers) return { customers: [] as CustomerWithStats[], totalCount: 0 };

      const baseMap = new Map(baseCustomers.map((c) => [c.id, c]));

      return {
        customers: data.customersStats
          .flatMap((s) => {
            const { customerId, ...stats } = s;
            const base = baseMap.get(customerId);
            if (!base) return null; // in case stats refer to a deleted customer

            return { ...base, stats };
          })
          .filter(Boolean) as CustomerWithStats[], // remove nulls
        totalCount: data.totalCount,
      };
    },
    enabled: !!baseCustomers,
    staleTime: 1000 * 60 * 60,
  });

  const handleReset = () => {
    setRanks(ALL_RANKS);
    setPeriod(DEFAULT_DATE);
  };

  return {
    customers: query.data?.customers ?? [],
    totalCount: query.data?.totalCount ?? 0,
    isLoading: query.isLoading || query.isFetching,
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
