import { CustomerContracts, PaginationRequest } from "@/app/(site)/lib/shared";
import { customersAPI } from "@/lib/server/api";
import { useManager } from "../useManager";
import { trpc } from "@/lib/server/client";

interface UseCustomersManagerParams extends PaginationRequest {}

export default function useCustomersManager({
  pagination: { page, pageSize },
}: UseCustomersManagerParams) {
  const query = customersAPI.getAllComprehensive.useQuery(
    { pagination: { page, pageSize } },
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
    smartUpdate: () => utils.customers.getAllComprehensive.invalidate(),
  });
}
