import { useEffect, useMemo, useState } from "react";
import {
  BackendActionsMap,
  BaseEntity,
  EntityType,
  MANAGER_LABELS,
} from "../../(domains)/backend/Manager";
import useQueryFilter from "../table/useGlobalFilter";
import useManagerActions from "./useManagerActions";
import { PathType } from "../../lib/api/fetchRequest";

interface UseManagerParams<T extends BaseEntity> {
  receivedData: T[];
  path: PathType;
  fetchActions: BackendActionsMap;
  type: EntityType;
}

export default function useManager<T extends BaseEntity>({
  receivedData,
  path,
  fetchActions,
  type,
}: UseManagerParams<T>) {
  const [data, setData] = useState<T[]>(receivedData);
  const [showOnlyActive, setShowOnlyActive] = useState(true);
  const { debouncedQuery, inputQuery, setInputQuery } = useQueryFilter();

  useEffect(() => setData(receivedData), [receivedData]);

  const actions = useManagerActions({
    setData,
    path,
    fetchActions,
    labels: MANAGER_LABELS,
    type,
  });

  const filteredData = useMemo(
    () => (showOnlyActive ? data.filter((d) => d.active) : data),
    [data, showOnlyActive]
  );

  return {
    filteredData,
    debouncedQuery,
    inputQuery,
    setInputQuery,
    showOnlyActive,
    setShowOnlyActive,
    actions,
  };
}
