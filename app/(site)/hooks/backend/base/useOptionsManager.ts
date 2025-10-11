import { optionsAPI } from "@/lib/server/api";
import { useManager } from "../useManager";
import { OptionContracts } from "@/app/(site)/lib/shared";
import { trpc } from "@/lib/server/client";

export default function useOptionsManager() {
  const query = optionsAPI.getAllWithCategories.useQuery();
  const create = optionsAPI.create.useMutation();
  const update = optionsAPI.update.useMutation();
  const toggle = optionsAPI.toggle.useMutation();
  const utils = trpc.useUtils();

  return useManager<
    OptionContracts.GetAllWithCategories.Output[number],
    OptionContracts.Create.Input["option"],
    OptionContracts.Update.Input["option"]
  >({
    data: query.data,
    isLoading: query.isLoading,
    actions: {
      addItem: (i) => create.mutateAsync({ option: i }),
      updateItem: (o, v) => update.mutateAsync({ option: { ...o, ...v } }),
      toggleItem: (i) => toggle.mutateAsync(i),
    },
    smartUpdate: (updater) => utils.options.getAllWithCategories.setData(undefined, updater),
  });
}
