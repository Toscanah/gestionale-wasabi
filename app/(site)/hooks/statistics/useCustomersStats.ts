import { DateRange } from "react-day-picker";
import { startOfYear, endOfYear, subDays, startOfDay, startOfMonth, endOfMonth } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import fetchRequest from "@/app/(site)/lib/api/fetchRequest";
import { GetCustomersWithStatsResponse } from "@/app/(site)/lib/shared/types/responses/customer";
import { CustomerWithStats } from "@/app/(site)/lib/shared/types/CustomerWithStats";
import { DatePreset } from "../../lib/shared/enums/DatePreset";
import useRfmRules from "../rfm/useRfmRules";
import useRfmRanks from "../rfm/useRfmRanks";
import React, { useEffect } from "react";

const today = new Date();
const DEFAULT_DATE: DateRange = {
  from: undefined,
  to: undefined,
};

type UseCustomersStatsParams = {
  page: number;
  pageSize: number;
  search: string;
};

export default function useCustomersStats({ page, pageSize, search }: UseCustomersStatsParams) {
  const { rfmRules } = useRfmRules();
  const { ranks } = useRfmRanks();

  const [dateFilter, setDateFilter] = React.useState<DateRange | undefined>(DEFAULT_DATE);
  const [rankFilter, setRankFilter] = React.useState<string>("all");

  const query = useQuery({
    queryKey: ["customers", { page, pageSize, search, dateFilter, rankFilter }],
    queryFn: async (): Promise<GetCustomersWithStatsResponse> =>
      await fetchRequest<GetCustomersWithStatsResponse>(
        "POST",
        "/api/customers",
        "computeCustomersStats",
        {
          filters: {
            from: dateFilter?.from,
            to: dateFilter?.to,
            search,
            rank: rankFilter,
          },
          page,
          pageSize,
          rfmConfig: { ranks, rules: rfmRules },
        }
      ),
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

  const handlePresetSelect = (value: DatePreset) => {
    switch (value) {
      case DatePreset.TODAY:
        setDateFilter({ from: startOfDay(today), to: startOfDay(today) });
        break;
      case DatePreset.YESTERDAY:
        const yesterday = subDays(today, 1);
        setDateFilter({ from: startOfDay(yesterday), to: startOfDay(yesterday) });
        break;
      case DatePreset.LAST_7:
        const last7 = subDays(today, 6);
        setDateFilter({ from: startOfDay(last7), to: startOfDay(today) });
        break;
      case DatePreset.LAST_30:
        const last30 = subDays(today, 29);
        setDateFilter({ from: startOfDay(last30), to: startOfDay(today) });
        break;
      case DatePreset.LAST_MONTH:
        const lastMonth = subDays(today, 30);
        setDateFilter({ from: startOfMonth(lastMonth), to: endOfMonth(lastMonth) });
      case DatePreset.THIS_MONTH:
        setDateFilter({ from: startOfMonth(today), to: endOfMonth(today) });
        break;
      case DatePreset.THIS_YEAR:
        setDateFilter({ from: startOfYear(today), to: endOfYear(today) });
        break;
    }
  };

  const handleReset = () => {
    setRankFilter("all");
    setDateFilter(DEFAULT_DATE);
  };

  return {
    customers: query.data?.customers ?? [],
    totalCount: query.data?.totalCount ?? 0,
    isLoading: query.isLoading,
    dateFilter,
    rankFilter,
    setRankFilter,
    setDateFilter,
    handlePresetSelect,
    handleReset,
    ranks,
  };
}
