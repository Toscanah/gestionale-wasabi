import { CustomerContracts, PaginationRequest } from "@/lib/shared";
import { customersAPI } from "@/lib/trpc/api";
import { useManager } from "../useManager";
import { trpc } from "@/lib/trpc/client";
import { useMemo, useState } from "react";
import useQueryFilter from "../../table/useQueryFilter";

interface UseCustomersManagerParams extends PaginationRequest {
  initialQuery?: string;
}

export default function useCustomersManager({
  pagination: { page, pageSize },
  initialQuery,
}: UseCustomersManagerParams) {
  const { debouncedQuery, inputQuery, setInputQuery, resetQuery } = useQueryFilter(
    500,
    initialQuery
  );
  const [showOnlyActive, setShowOnlyActive] = useState(true);

  const filters = useMemo(() => {
    const filters: Record<string, any> = {};

    if (debouncedQuery) filters.query = debouncedQuery;
    if (showOnlyActive) filters.onlyActive = showOnlyActive;

    return Object.keys(filters).length > 0 ? filters : undefined;
  }, [debouncedQuery, showOnlyActive]);

  const query = customersAPI.getAllComprehensive.useQuery(
    { pagination: { page, pageSize }, filters },
    { placeholderData: (prev) => prev }
  );

  const create = customersAPI.create.useMutation();
  const update = customersAPI.updateFromAdmin.useMutation();
  const toggle = customersAPI.toggle.useMutation();
  const utils = trpc.useUtils();

  return useManager<
    CustomerContracts.GetAllComprehensive.Output["customers"][number],
    CustomerContracts.Create.Input["customer"],
    CustomerContracts.UpdateFromAdmin.Input["customer"]
  >({
    data: query.data?.customers,
    isLoading: query.isLoading || query.isFetching,
    totalCount: query.data?.totalCount || 0,
    actions: {
      addItem: (i) => create.mutateAsync({ customer: i }),
      updateItem: (o, v) => update.mutateAsync({ customer: { ...o, ...v } }),
      toggleItem: (i) => toggle.mutateAsync(i),
    },
    serverFiltering: {
      showOnlyActive,
      setShowOnlyActive,
      debouncedQuery,
      setInputQuery,
      inputQuery,
      resetQuery,
    },
    smartUpdate: () => utils.customers.getAllComprehensive.invalidate(),
  });
}
