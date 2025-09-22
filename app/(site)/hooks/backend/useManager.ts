import { useMemo, useState } from "react";
import { MANAGER_LABELS } from "../../(domains)/backend/Manager";
import useQueryFilter from "../table/useQueryFilter";
import useManagerActions, { ManagerDomain } from "./useManagerActions";
import { trpc } from "@/lib/server/client";

interface UseManagerParams<D extends ManagerDomain> {
  domain: D;
}

export default function useManager<D extends ManagerDomain>({ domain }: UseManagerParams<D>) {
  const [showOnlyActive, setShowOnlyActive] = useState(true);
  const { debouncedQuery, inputQuery, setInputQuery } = useQueryFilter();

  const queryMap = {
    products: trpc.products.getAll,
    customers: trpc.customers.getAllComprehensive,
    categories: trpc.categories.getAll,
    options: trpc.options.getAll,
  }[domain];

  const { data, isLoading } = queryMap.useQuery(undefined);

  const toggle = {
    products: trpc.products.toggle.useMutation(),
    customers: trpc.customers.toggle.useMutation(),
    categories: trpc.categories.toggle.useMutation(),
    options: trpc.options.toggle.useMutation(),
  }[domain];

  const update = {
    products: trpc.products.update.useMutation(),
    customers: trpc.customers.updateFromAdmin.useMutation(),
    categories: trpc.categories.update.useMutation(),
    options: trpc.options.update.useMutation(),
  }[domain];

  const add = {
    products: trpc.products.create.useMutation(),
    customers: trpc.customers.create.useMutation(),
    categories: trpc.categories.create.useMutation(),
    options: trpc.options.create.useMutation(),
  }[domain];

  // const del = {
  //   products: trpc.products.delete.useMutation(),
  //   customers: trpc.customers.deleteById.useMutation(),
  //   categories: trpc.categories.delete.useMutation(),
  //   options: trpc.options.delete.useMutation(),
  // }[domain];

  const actions = useManagerActions({
    domain,
    labels: MANAGER_LABELS,
    actions: {
      toggle: (obj) => toggle.mutateAsync({ id: obj.id }),
      update: (obj, values) => update.mutateAsync({ id: obj.id, ...values }),
      add: (values) => add.mutateAsync({ ...values, active: true }),
      // delete: (obj) => del.mutateAsync({ id: obj.id }).then(() => true),
    },
  });

  const filteredData = useMemo(
    () => (showOnlyActive ? (data?.filter((d) => d.active) ?? []) : (data ?? [])),
    [data, showOnlyActive]
  );

  return {
    filteredData,
    isLoading,
    debouncedQuery,
    inputQuery,
    setInputQuery,
    showOnlyActive,
    setShowOnlyActive,
    actions,
  };
}
