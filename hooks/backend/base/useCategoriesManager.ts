import { categoriesAPI } from "@/lib/trpc/api";
import { trpc } from "@/lib/trpc/client";
import { useManager } from "../useManager";
import { CategoryContracts } from "@/lib/shared";

export default function useCategoriesManager() {
  const query = categoriesAPI.getAll.useQuery();
  const create = categoriesAPI.create.useMutation();
  const update = categoriesAPI.update.useMutation();
  const toggle = categoriesAPI.toggle.useMutation();
  const utils = trpc.useUtils();

  return useManager<
    CategoryContracts.GetAll.Output[number],
    CategoryContracts.Create.Input["category"],
    CategoryContracts.Update.Input["category"]
  >({
    data: query.data,
    isLoading: query.isLoading,
    actions: {
      addItem: (i) => create.mutateAsync({ category: i }),
      updateItem: (o, v) => update.mutateAsync({ category: { ...o, ...v } }),
      toggleItem: (i) => toggle.mutateAsync(i),
    },
    smartUpdate: (updater) => utils.categories.getAll.setData(undefined, updater),
  });
}
