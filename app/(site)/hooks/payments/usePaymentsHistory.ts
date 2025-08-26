import { useQuery } from "@tanstack/react-query";
import { DateRange } from "react-day-picker";
import { useState } from "react";
import { OrderWithPayments } from "@/app/(site)/lib/shared";
import { OrderType } from "@prisma/client";
import { ShiftType } from "../../lib/shared/enums/Shift";
import fetchRequest from "../../lib/api/fetchRequest";
import calculatePaymentsSummary, {
  DEFAULT_SUMMARY_DATA,
  PaymentsSummaryData,
} from "../../lib/services/payments/calculatePaymentsSummary";

type UsePaymentsHistoryParams = {
  page: number;
  pageSize: number;
};

export default function usePaymentsHistory({ page, pageSize }: UsePaymentsHistoryParams) {
  const [typeFilter, setTypeFilter] = useState<OrderType | "all">("all");
  const [shiftFilter, setShiftFilter] = useState<ShiftType | "all">("all");

  const [timeScope, setTimeScope] = useState<"single" | "range">("single");
  const [singleDate, setSingleDate] = useState<Date | undefined>(new Date());
  const [rangeDate, setRangeDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });

  // --- paginated query (table) ---
  const paginatedQuery = useQuery({
    queryKey: [
      "payments",
      { page, pageSize, typeFilter, shiftFilter, timeScope, singleDate, rangeDate },
    ],
    queryFn: async (): Promise<{ orders: OrderWithPayments[]; totalCount: number }> =>
      await fetchRequest("POST", "/api/payments", "getOrdersWithPayments", {
        filters: {
          type: typeFilter === "all" ? undefined : (typeFilter as OrderType),
          shift: shiftFilter === "all" ? undefined : (shiftFilter as ShiftType),
          timeScope,
          singleDate,
          rangeDate:
            rangeDate?.from && rangeDate?.to
              ? { from: rangeDate.from, to: rangeDate.to }
              : undefined,
        },
        page,
        pageSize,
      }),
    staleTime: 1000 * 60 * 10,
  });

  // --- summary query (ignores pagination) ---
  const summaryQuery = useQuery({
    queryKey: ["payments-summary", { typeFilter, shiftFilter, timeScope, singleDate, rangeDate }],
    queryFn: async (): Promise<PaymentsSummaryData> => {
      const res = await fetchRequest<{ orders: OrderWithPayments[]; totalCount: number }>(
        "POST",
        "/api/payments",
        "getOrdersWithPayments",
        {
          filters: {
            type: typeFilter === "all" ? undefined : (typeFilter as OrderType),
            shift: shiftFilter === "all" ? undefined : (shiftFilter as ShiftType),
            timeScope,
            singleDate,
            rangeDate:
              rangeDate?.from && rangeDate?.to
                ? { from: rangeDate.from, to: rangeDate.to }
                : undefined,
          },
          page: 0,
          pageSize: 0,
          summary: true,
        }
      );
      return calculatePaymentsSummary(res.orders);
    },
    staleTime: 1000 * 60 * 10,
  });

  const handleReset = () => {
    setTypeFilter("all");
    setShiftFilter("all");
    setTimeScope("single");
    setSingleDate(new Date());
    setRangeDate(undefined);
  };

  return {
    orders: paginatedQuery.data?.orders ?? [],
    totalCount: paginatedQuery.data?.totalCount ?? 0,
    isLoading: paginatedQuery.isLoading,
    typeFilter,
    setTypeFilter,
    shiftFilter,
    setShiftFilter,
    timeScope,
    setTimeScope,
    singleDate,
    setSingleDate,
    rangeDate,
    setRangeDate,
    handleReset,

    // summary
    summaryData: summaryQuery.data ?? DEFAULT_SUMMARY_DATA,
  };
}
