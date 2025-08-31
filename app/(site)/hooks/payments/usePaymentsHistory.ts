import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DateRange } from "react-day-picker";
import { ShiftFilterValue, OrderContract } from "@/app/(site)/lib/shared";
import { OrderType } from "@prisma/client";
import fetchRequest from "../../lib/api/fetchRequest";
import calculatePaymentsSummary, {
  DEFAULT_SUMMARY_DATA,
  PaymentsSummaryData,
} from "../../lib/services/payments/calculatePaymentsSummary";
import useQueryFilter from "../table/useGlobalFilter";
import TODAY_PERIOD from "../../lib/shared/constants/today-period";
import { PaginationRequest } from "../../lib/shared/schemas/common/pagination";

type UsePaymentsHistoryParams = PaginationRequest;

export default function usePaymentsHistory({ page, pageSize }: UsePaymentsHistoryParams) {
  const { debouncedQuery, inputQuery, setInputQuery } = useQueryFilter();
  const [shift, setShift] = useState<ShiftFilterValue>(ShiftFilterValue.ALL);
  const [period, setPeriod] = useState<DateRange | undefined>(TODAY_PERIOD);
  const [orderTypes, setOrderTypes] = useState<OrderType[]>([
    OrderType.HOME,
    OrderType.PICKUP,
    OrderType.TABLE,
  ]);

  const filters: OrderContract["Requests"]["GetOrdersWithPayments"]["filters"] = useMemo(() => {
    const periodFilter = period?.from ? { from: period.from, to: period.to } : undefined;
    const typeFilter = orderTypes.length === Object.keys(OrderType).length ? undefined : orderTypes;

    const shiftFilter = shift === ShiftFilterValue.ALL ? undefined : shift;

    return {
      period: periodFilter,
      orderTypes: typeFilter,
      shift: shiftFilter,
      query: debouncedQuery.trim() || undefined,
    };
  }, [period, orderTypes, shift, debouncedQuery]);

  type Res = OrderContract["Responses"]["GetOrdersWithPayments"];

  const paginatedQuery = useQuery({
    queryKey: ["payments", { page, pageSize, filters }],
    queryFn: async (): Promise<Res> =>
      await fetchRequest("POST", "/api/orders", "getOrdersWithPayments", {
        filters,
        page,
        pageSize,
      }),
    staleTime: 1000 * 60 * 10,
  });

  const summaryQuery = useQuery({
    queryKey: ["payments-summary", { filters }],
    queryFn: async (): Promise<PaymentsSummaryData> => {
      const res = await fetchRequest<Res>("POST", "/api/orders", "getOrdersWithPayments", {
        filters,
        page: 0,
        pageSize: 0,
        summary: true,
      });
      return calculatePaymentsSummary(res.orders);
    },
    staleTime: 1000 * 60 * 10,
  });

  // ---- reset ----
  const handleReset = () => {
    setOrderTypes([OrderType.HOME, OrderType.PICKUP, OrderType.TABLE]);
    setShift(ShiftFilterValue.ALL);
    setPeriod(TODAY_PERIOD);
  };

  const isDefaultOrderTypes = (orderTypes: OrderType[]) =>
    orderTypes.length === Object.keys(OrderType).length;

  const isDefaultShift = (shift: ShiftFilterValue) => shift === ShiftFilterValue.ALL;

  const isDefaultPeriod = (period: DateRange | undefined, defaultPeriod: DateRange) =>
    period?.from?.getTime() === defaultPeriod?.from?.getTime() &&
    period?.to?.getTime() === defaultPeriod?.to?.getTime();

  return {
    // table
    filteredOrders: paginatedQuery.data?.orders ?? [],
    totalCount: paginatedQuery.data?.totalCount ?? 0,
    isLoading: paginatedQuery.isLoading,

    // filters state
    orderTypes,
    setOrderTypes,
    shift,
    setShift,
    period,
    setPeriod,
    handleReset,
    debouncedQuery,
    inputQuery,
    setInputQuery,
    showReset: !(
      isDefaultOrderTypes(orderTypes) &&
      isDefaultShift(shift) &&
      isDefaultPeriod(period, TODAY_PERIOD)
    ),
    // summary
    summaryData: summaryQuery.data ?? DEFAULT_SUMMARY_DATA,
  };
}
