import { toastError, toastSuccess } from "../../lib/utils/global/toast";
import { trpc } from "@/lib/server/client";
import {
  CategoryContracts,
  CustomerContracts,
  OptionContracts,
  ProductContracts,
} from "../../lib/shared";
import { MANAGER_LABELS } from "../../(domains)/backend/Manager";

export type BaseEntity = { id: number; active: boolean };

type DomainMap = {
  products: ProductContracts.GetAll.Output;
  customers: CustomerContracts.GetAllComprehensive.Output["customers"];
  categories: CategoryContracts.GetAll.Output;
  options: OptionContracts.GetAll.Output;
};

export type ManagerDomain = keyof DomainMap;
export type EntityOf<D extends ManagerDomain> = DomainMap[D][number] & BaseEntity;

type CacheSetter<T> = {
  setData: (input: undefined, updater: (old: T[] | undefined) => T[] | undefined) => void;
  invalidate: () => void;
};

interface ManagerActions<T> {
  toggle: (obj: T) => Promise<T | void>;
  update: (obj: T, newValues: Partial<T>) => Promise<T | void>;
  add: (values: Partial<T>) => Promise<T | void>;
  delete?: (obj: T) => Promise<boolean>;
}

interface UseActionsParams<D extends ManagerDomain> {
  domain: D;
  labels: typeof MANAGER_LABELS;
  actions: ManagerActions<EntityOf<D>>;
}

export default function useManagerActions<D extends ManagerDomain>({
  domain,
  labels,
  actions,
}: UseActionsParams<D>) {
  const utils = trpc.useUtils();

  const cache = {
    products: utils.products.getAll as CacheSetter<EntityOf<"products">>,
    customers: utils.customers.getAllComprehensive as CacheSetter<EntityOf<"customers">>,
    categories: utils.categories.getAll as CacheSetter<EntityOf<"categories">>,
    options: utils.options.getAll as CacheSetter<EntityOf<"options">>,
  }[domain] as unknown as CacheSetter<EntityOf<D>>;

  const invalidate = () => cache.invalidate();

  const handleToggle = async (obj: EntityOf<D> & { id: number; active: boolean }) => {
    const updated = await actions.toggle(obj);
    if (updated) {
      cache.setData(undefined, (old) =>
        old ? old.map((el) => (el.id === obj.id ? updated : el)) : old
      );
      toastSuccess(
        `L'elemento è stato ${obj.active ? labels.toggledOff : labels.toggledOn} correttamente`
      );
    } else {
      invalidate();
    }
  };

  const handleUpdate = async (obj: EntityOf<D> & { id: number }, values: Partial<EntityOf<D>>) => {
    const updated = await actions.update(obj, values);
    if (updated) {
      cache.setData(undefined, (old) =>
        old ? old.map((el) => (el.id === obj.id ? updated : el)) : old
      );
      toastSuccess(labels.editSuccess);
    } else {
      toastError(labels.error);
      invalidate();
    }
  };

  const handleAdd = async (values: Partial<EntityOf<D>>) => {
    const newObject = await actions.add(values);
    if (newObject) {
      cache.setData(undefined, (old) => (old ? [...old, newObject] : [newObject]));
      toastSuccess(labels.addSuccess);
    } else {
      toastError(labels.exists);
      invalidate();
    }
  };

  const handleDelete = async (obj: EntityOf<D> & { id: number }) => {
    if (!actions.delete) return;
    const ok = await actions.delete(obj);
    if (ok) {
      cache.setData(undefined, (old) => (old ? old.filter((el) => el.id !== obj.id) : old));
      toastSuccess(labels.deleteSuccess);
    } else {
      toastError(labels.deleteError);
      invalidate();
    }
  };

  return { handleToggle, handleUpdate, handleAdd, handleDelete };
}
