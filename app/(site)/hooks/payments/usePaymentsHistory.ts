import { useMemo, useState } from "react";
import { DateRange } from "react-day-picker";
import { OrderContracts, PaymentContracts, ShiftFilterValue } from "@/app/(site)/lib/shared";
import { OrderType, PaymentType } from "@/prisma/generated/client/enums";
import useQueryFilter from "../table/useQueryFilter";
import TODAY_PERIOD from "../../lib/shared/constants/today-period";
import { ordersAPI, paymentsAPI } from "@/lib/server/api";

type UsePaymentsHistoryParams = {
  page: number;
  pageSize: number;
};

const DEFAULT_PAYMENTS_SUMMARY: PaymentContracts.GetSummary.Output = {
  totals: {
    [PaymentType.CASH]: { label: "Contanti", total: 0 },
    [PaymentType.CARD]: { label: "Carta", total: 0 },
    [PaymentType.VOUCH]: { label: "Buoni", total: 0 },
    [PaymentType.CREDIT]: { label: "Crediti", total: 0 },
    [PaymentType.PROMOTION]: { label: "Promozioni", total: 0 },
  },
  inPlaceAmount: 0,
  takeawayAmount: 0,
  homeOrdersAmount: 0,
  pickupOrdersAmount: 0,
  tableOrdersAmount: 0,
  customersCount: 0,
  homeOrdersCount: 0,
  pickupOrdersCount: 0,
  tableOrdersCount: 0,
  totalAmount: 0,
  rawTotalAmount: 0,
  centsDifference: 0,
  discountsAndPromotions: {
    manual: 0,
    fixed_promotions: 0,
    percentage_promotions: 0,
    gift_cards: 0,
  },
};

export default function usePaymentsHistory({ page, pageSize }: UsePaymentsHistoryParams) {
  const { debouncedQuery, inputQuery, setInputQuery } = useQueryFilter();
  const [shift, setShift] = useState<ShiftFilterValue>(ShiftFilterValue.ALL);
  const [period, setPeriod] = useState<DateRange | undefined>(TODAY_PERIOD);
  const [orderTypes, setOrderTypes] = useState<OrderType[]>([
    OrderType.HOME,
    OrderType.PICKUP,
    OrderType.TABLE,
  ]);

  const filters: NonNullable<OrderContracts.GetWithPayments.Input>["filters"] = useMemo(() => {
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

  const {
    data: summaryData,
    isLoading: isLoadingSummary,
    isFetching: isFetchingSummary,
  } = paymentsAPI.getSummary.useQuery(
    {
      filters,
    },
    {
      placeholderData: (prev) => prev,
    }
  );

  const {
    data: paginatedPayments,
    isLoading: isLoadingPayments,
    isFetching: isFetchingPayments,
  } = ordersAPI.getWithPayments.useQuery(
    {
      filters,
      pagination:
        pageSize !== null && !isNaN(pageSize) && pageSize > 0 ? { page, pageSize } : undefined,
    },
    {
      placeholderData: (prev) => prev,
    }
  );

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
    filteredOrders: paginatedPayments?.orders ?? [],
    totalCount: paginatedPayments?.totalCount ?? 0,
    isLoading: isLoadingPayments || isLoadingSummary || isFetchingPayments || isFetchingSummary,

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
    summaryData: summaryData ?? DEFAULT_PAYMENTS_SUMMARY,
  };
}
