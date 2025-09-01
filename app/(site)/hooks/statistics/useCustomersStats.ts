import { DateRange } from "react-day-picker";
import { useQuery } from "@tanstack/react-query";
import fetchRequest from "@/app/(site)/lib/api/fetchRequest";
import useRfmRules from "../rfm/useRfmRules";
import useRfmRanks from "../rfm/useRfmRanks";
import { useMemo, useState } from "react";
import { CustomerContract } from "../../lib/shared";
import useQueryFilter from "../table/useGlobalFilter";

const DEFAULT_DATE: DateRange = {
  from: undefined,
  to: undefined,
};

type UseCustomersStatsParams = {
  page: number;
  pageSize: number;
};

export default function useCustomersStats({ page, pageSize }: UseCustomersStatsParams) {
  const { rfmRules } = useRfmRules();
  const { ranks: rfmRanks } = useRfmRanks();

  const ALL_RANKS = rfmRanks.map((r) => r.rank);

  const { debouncedQuery, inputQuery, setInputQuery } = useQueryFilter();
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

  const { data: RFMbackfill } = useQuery({
    queryKey: ["rfmBackfill"],
    queryFn: () => fetchRequest("PATCH", "/api/customers", "updateCustomersRFM", { rfmConfig }),
    staleTime: Infinity,
  });

  const query = useQuery({
    queryKey: ["customers", { page, pageSize, filters }],
    queryFn: async () =>
      await fetchRequest<CustomerContract["Responses"]["ComputeCustomersStats"]>(
        "POST",
        "/api/customers",
        "computeCustomersStats",
        {
          filters,
          page,
          pageSize,
        }
      ),
    enabled: !!RFMbackfill,
    staleTime: 1000 * 60 * 60,
  });

  // useEffect(() => {
  //   if (!query.data) return;
  //   if (page === 0 && pageSize >= 50) {
  //     const { customers, totalCount } = query.data;
  //     const base = { search, dateFilter, rankFilter };

  //     // hydrate smaller page sizes
  //     [10, 20, 30, 40, 50].forEach((s) => {
  //       if (s >= pageSize) return;
  //       const pagesAvailable = Math.min(Math.ceil(customers.length / s), 10);
  //       for (let p = 0; p < pagesAvailable; p++) {
  //         queryClient.setQueryData(["customers", { page: p, pageSize: s, ...base }], {
  //           customers: customers.slice(p * s, (p + 1) * s),
  //           totalCount,
  //         });
  //       }
  //     });
  //   }
  // }, [query.data, page, pageSize, search, dateFilter, rankFilter, queryClient]);

  const handleReset = () => {
    setRanks(ALL_RANKS);
    setPeriod(DEFAULT_DATE);
  };

  return {
    customers: query.data?.customers ?? [],
    totalCount: query.data?.totalCount ?? 0,
    isLoading: query.isLoading,
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
  };
}
