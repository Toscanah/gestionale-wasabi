import { BackendActionsMap, BaseEntity, EntityType, MANAGER_LABELS } from "../../(domains)/backend/Manager";
import fetchRequest, { PathType } from "../../lib/api/fetchRequest";
import { toastError, toastSuccess } from "../../lib/utils/toast";

interface UseActionsParams<T extends BaseEntity> {
  setData: React.Dispatch<React.SetStateAction<T[]>>;
  path: PathType;
  fetchActions: BackendActionsMap;
  type: EntityType;
  labels: typeof MANAGER_LABELS;
}

export default function useManagerActions<T extends BaseEntity>({
  setData,
  path,
  fetchActions,
  labels,
  type,
}: UseActionsParams<T>) {
  const handleToggle = async (obj: T) => {
    fetchRequest<T>("PATCH", path, fetchActions.toggle, {
      id: obj.id,
    }).then(() => {
      setData((prev) =>
        prev.map((el) => (el.id === obj.id ? { ...obj, active: !obj.active } : el))
      );

      toastSuccess(
        `L'elemento è stato ${obj.active ? labels.toggledOff : labels.toggledOn} correttamente`
      );
    });
  };

  const handleUpdate = (newValues: Partial<T>, obj: T) =>
    fetchRequest<T>("PATCH", path, fetchActions.update, {
      [type]: {
        id: obj.id,
        ...newValues,
      },
    }).then((updatedObject) => {
      if (!updatedObject) {
        return toastError(labels.error);
      }

      setData((prev) => prev.map((el) => (el.id === obj.id ? updatedObject : el)));
      toastSuccess(labels.editSuccess);
    });

  const handleAdd = (values: Partial<T>) => {
    fetchRequest<T>("POST", path, fetchActions.add, { [type]: { ...values, active: true } }).then(
      (newObject) => {
        if (!newObject) {
          return toastError(labels.exists);
        }

        setData((prev) => [...prev, newObject]);
        toastSuccess(labels.addSuccess);
      }
    );
  };

  const handleDelete = (obj: T) => {
    if (!fetchActions.delete) return;

    fetchRequest<T>("DELETE", path, fetchActions.delete, {
      id: obj.id,
    }).then((response) => {
      if (!response) {
        return toastError(labels.deleteError);
      }

      setData((prev) => prev.filter((el) => el.id !== obj.id));
      toastSuccess(labels.deleteSuccess);
    });
  };

  return {
    handleToggle,
    handleUpdate,
    handleAdd,
    handleDelete,
  };
}
