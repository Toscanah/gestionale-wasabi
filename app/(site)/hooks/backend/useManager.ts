import { useMemo, useState } from "react";
import useQueryFilter from "../table/useQueryFilter";
import { toastError, toastSuccess } from "../../lib/utils/global/toast";
import { ToggleEntityResponse } from "../../lib/shared";
import { MANAGER_LABELS } from "../../lib/shared/constants/manager-labels";

export type BaseEntity = { id: number; active?: boolean };

interface UseManagerParams<
  TData extends BaseEntity,
  TCreate = Partial<TData>,
  TUpdate = Partial<TData>,
> {
  data?: TData[];
  totalCount?: number;
  isLoading: boolean;
  actions: {
    addItem: (input: TCreate) => Promise<TData>;
    toggleItem: (input: { id: number }) => Promise<ToggleEntityResponse>;
    updateItem: (obj: TData, values: TUpdate) => Promise<TData>;
    deleteItem?: (input: { id: number }) => Promise<void>;
  };
  smartUpdate: (updater: (old?: TData[]) => TData[] | undefined) => void;
  serverFiltering?: {
    showOnlyActive?: boolean;
    setShowOnlyActive?: (v: boolean) => void;
    debouncedQuery?: string;
    setInputQuery?: (v: string) => void;
    inputQuery?: string;
    resetQuery?: () => void;
  };
}

export function useManager<
  TData extends BaseEntity,
  TCreate = Partial<TData>,
  TUpdate = Partial<TData>,
>({
  data,
  isLoading,
  actions,
  smartUpdate,
  totalCount,
  serverFiltering,
}: UseManagerParams<TData, TCreate, TUpdate>) {
  const [showOnlyActive, setShowOnlyActive] = useState(true);
  const { debouncedQuery, inputQuery, setInputQuery, resetQuery } = useQueryFilter();

  function handleManagerAction<T>(
    action: () => Promise<T>,
    onSuccess: (result: T) => void,
    successMessage: string
  ) {
    action()
      .then(onSuccess)
      .then(() => toastSuccess(successMessage))
      .catch((err: any) => {
        if (err?.data?.code === "CONFLICT") {
          toastError(MANAGER_LABELS.exists);
        } else {
          toastError(MANAGER_LABELS.error);
        }
      });
  }

  function handleToggle(obj: TData) {
    handleManagerAction(
      () => actions.toggleItem({ id: obj.id }),
      (updated) =>
        smartUpdate((old) =>
          old?.map((el) => (el.id === obj.id ? { ...el, active: updated.active } : el))
        ),
      `L'elemento è stato ${
        obj.active ? MANAGER_LABELS.toggledOff : MANAGER_LABELS.toggledOn
      } correttamente`
    );
  }

  function handleUpdate(obj: TData, values: TUpdate) {
    handleManagerAction(
      () => actions.updateItem(obj, values),
      (updated) => smartUpdate((old) => old?.map((el) => (el.id === obj.id ? updated : el))),
      MANAGER_LABELS.editSuccess
    );
  }

  function handleAdd(values: TCreate) {
    handleManagerAction(
      () => actions.addItem({ ...values, active: true }),
      (created) => smartUpdate((old) => (old ? [...old, created] : [created])),
      MANAGER_LABELS.addSuccess
    );
  }

  function handleDelete(obj: TData) {
    if (!actions.deleteItem) return;
    actions
      .deleteItem({ id: obj.id })
      .then(() => {
        smartUpdate((old) => old?.filter((el) => el.id !== obj.id));
        toastSuccess(MANAGER_LABELS.deleteSuccess);
      })
      .catch(() => toastError(MANAGER_LABELS.error));
  }

  const isServerFiltering = !!serverFiltering;

  const filteredData = useMemo(() => {
    if (isServerFiltering) return data ?? [];
    if (showOnlyActive) return data?.filter((d) => d.active) ?? [];
    return data ?? [];
  }, [data, showOnlyActive, isServerFiltering]);

  const effectiveShowOnlyActive = serverFiltering?.showOnlyActive ?? showOnlyActive;
  const effectiveSetShowOnlyActive = serverFiltering?.setShowOnlyActive ?? setShowOnlyActive;

  const effectiveDebouncedQuery = serverFiltering?.debouncedQuery ?? debouncedQuery;
  const effectiveSetInputQuery = serverFiltering?.setInputQuery ?? setInputQuery;
  const effectiveInputQuery = serverFiltering?.inputQuery ?? inputQuery;
  const effectiveResetQuery = serverFiltering?.resetQuery ?? resetQuery;

  return {
    data: filteredData,
    isLoading,
    debouncedQuery: effectiveDebouncedQuery,
    inputQuery: effectiveInputQuery,
    setInputQuery: effectiveSetInputQuery,
    resetQuery: effectiveResetQuery,
    showOnlyActive: effectiveShowOnlyActive,
    setShowOnlyActive: effectiveSetShowOnlyActive,
    actions: {
      handleToggle,
      handleUpdate,
      handleAdd,
      handleDelete,
    },
    totalCount: totalCount ?? filteredData.length,
  };
}
