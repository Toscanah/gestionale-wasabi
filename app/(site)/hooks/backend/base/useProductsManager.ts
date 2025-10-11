import { PaginationRequest, ProductContracts } from "@/app/(site)/lib/shared";
import { trpc } from "@/lib/server/client";
import { useManager } from "../useManager";
import { productsAPI } from "@/lib/server/api";
import { useMemo, useState } from "react";

interface UseProductsManagerParams extends PaginationRequest {
  categoryIds?: number[];
  sort?: NonNullable<ProductContracts.GetAll.Input>["sort"];
}

export default function useProductsManager({
  categoryIds,
  pagination: { page, pageSize },
  sort,
}: UseProductsManagerParams) {
  const [showOnlyActive, setShowOnlyActive] = useState(true);

  const filters = useMemo(() => {
    const filterObj: Record<string, any> = {};
    if (categoryIds) filterObj.categoryIds = categoryIds;
    if (showOnlyActive) filterObj.onlyActive = showOnlyActive;
    return Object.keys(filterObj).length > 0 ? filterObj : undefined;
  }, [categoryIds, showOnlyActive]);

  const query = productsAPI.getAll.useQuery(
    {
      ...(filters ? { filters } : {}),
      pagination: { page, pageSize },
      sort: sort?.length ? sort : undefined,
    },
    {
      placeholderData: (prev) => prev,
    }
  );
  const create = productsAPI.create.useMutation();
  const update = productsAPI.update.useMutation();
  const toggle = productsAPI.toggle.useMutation();
  const utils = trpc.useUtils();

  return useManager<
    ProductContracts.GetAll.Output["products"][number],
    ProductContracts.Create.Input["product"],
    ProductContracts.Update.Input["product"]
  >({
    data: query.data?.products ?? [],
    totalCount: query.data?.totalCount ?? 0,
    isLoading: query.isLoading || query.isFetching,
    actions: {
      addItem: (i) => create.mutateAsync({ product: i }),
      updateItem: (o, v) => update.mutateAsync({ product: { ...o, ...v } }),
      toggleItem: (i) => toggle.mutateAsync(i),
    },
    smartUpdate: () => utils.products.getAll.invalidate(),
    serverFiltering: {
      showOnlyActive,
      setShowOnlyActive,
    },
  });
}
