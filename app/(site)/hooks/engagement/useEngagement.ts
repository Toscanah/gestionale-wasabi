import { useMemo, useState } from "react";
import { ComprehensiveCustomer, CustomerContracts } from "../../lib/shared";
import { EngagementType } from "@prisma/client";
import { trpc } from "@/lib/server/client";
import { DateRange } from "react-day-picker";
import TODAY_PERIOD from "../../lib/shared/constants/today-period";
import { ENGAGEMENT_TYPES_LABELS } from "../../lib/shared/constants/engagement-types-labels";
import useQueryFilter from "../table/useQueryFilter";

function filterRightCustomers(customers: ComprehensiveCustomer[], activeTypes: EngagementType[]) {
  return customers.filter((c) =>
    c.engagements.length === 0
      ? activeTypes.length === ENGAGEMENT_TYPES_LABELS.length
      : c.engagements.some((e) => activeTypes.includes(e.template.type))
  );
}

type UseEngagementParams = {
  page: number;
  pageSize: number;
};

export default function useEngagement({ page, pageSize }: UseEngagementParams) {
  const [selectedCustomers, setSelectedCustomers] = useState<ComprehensiveCustomer[]>([]);
  const [period, setPeriod] = useState<DateRange | undefined>(TODAY_PERIOD);
  const { debouncedQuery, inputQuery, setInputQuery } = useQueryFilter();

  const [activeTypes, setActiveTypes] = useState<EngagementType[]>(Object.values(EngagementType));

  const filters: NonNullable<CustomerContracts.GetAllComprehensive.Input>["filters"] = useMemo(() => {
    const periodFilter = period?.from
      ? { from: period.from, to: period.to ?? period.from }
      : undefined;

    const search = debouncedQuery && debouncedQuery.trim() !== "" ? debouncedQuery : undefined;

    return {
      orders: { period: periodFilter },
      query: search,
    };
  }, [period, debouncedQuery]);

  const utils = trpc.useUtils();
  const { data, isLoading, isFetching } = trpc.customers.getAllComprehensive.useQuery(
    {
      filters,
      pagination:
        pageSize !== null && !isNaN(pageSize) && pageSize > 0
          ? {
              page,
              pageSize,
            }
          : undefined,
    },
    {
      placeholderData: (prev) => prev,
    }
  );

  const leftCustomers = data?.customers ?? [];

  // ✅ Right customers = only the ones explicitly selected
  const rightCustomers = useMemo(
    () => filterRightCustomers(selectedCustomers, activeTypes),
    [selectedCustomers, activeTypes]
  );

  const onLeftTableRowClick = (customer: ComprehensiveCustomer) => {
    if (!selectedCustomers.some((c) => c.id === customer.id)) {
      setSelectedCustomers((prev) => [...prev, customer]);
    }
  };

  const onRightTableRowClick = (customer: ComprehensiveCustomer) => {
    setSelectedCustomers((prev) => prev.filter((c) => c.id !== customer.id));
  };

  const clearSelectedCustomers = () => {
    setSelectedCustomers([]);
    utils.customers.getAllComprehensive.invalidate();
  };

  const handleReset = () => {
    setPeriod(TODAY_PERIOD);
    setInputQuery("");
  };

  return {
    handleReset,
    clearSelectedCustomers,
    leftCustomers,
    rightCustomers,
    period,
    setPeriod,
    activeTypes,
    setActiveTypes,
    onLeftTableRowClick,
    onRightTableRowClick,
    isLoading: isLoading || isFetching,
    inputQuery,
    setInputQuery,
    debouncedQuery,
    totalCount: data?.totalCount ?? 0,
  };
}
