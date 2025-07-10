"use client";

import { ComponentType, ReactNode, useEffect, useState } from "react";
import useGlobalFilter from "../../hooks/useGlobalFilter";
import { Pencil, Plus, Trash } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import TableControls from "../../components/table/TableControls";
import Table from "../../components/table/Table";
import DialogWrapper from "../../components/ui/dialog/DialogWrapper";
import { ColumnDef } from "@tanstack/react-table";
import getColumns from "./getColumns";
import getTable from "../../lib/utils/getTable";
import { toastError, toastSuccess } from "../../lib/utils/toast";
import fetchRequest, {
  APIEndpoint,
  PathType,
  ValidActionKeys,
} from "../../lib/api/fetchRequest";

import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { TablePagination } from "../../components/table/TablePagination";

enum Actions {
  UPDATE = "update",
  ADD = "add",
  TOGGLE = "toggle",
  DELETE = "delete",
}

export type ActionsType = Omit<{ [key in Actions]: ValidActionKeys }, Actions.DELETE> & {
  [Actions.DELETE]?: ValidActionKeys;
};

interface ManagerProps<T extends { id: number; active: boolean }> {
  receivedData: T[];
  path: PathType;
  fetchActions: ActionsType;
  FormFields: ComponentType<FormFieldsProps<T>>;
  columns: ColumnDef<T>[];
  type: "product" | "category" | "option" | "customer";
  addionalFilters?: ReactNode[];
  pagination?: boolean;
  deleteAction?: boolean;
}

interface FormFieldsProps<T extends { id: number; active: boolean }> {
  handleSubmit: (values: Partial<T>) => void;
  footerName: string;
  object?: T;
}

export default function Manager<T extends { id: number; active: boolean }>({
  receivedData,
  path,
  fetchActions,
  columns,
  FormFields,
  type,
  addionalFilters,
  pagination = false,
  deleteAction = false,
}: ManagerProps<T>) {
  const [globalFilter, setGlobalFilter] = useGlobalFilter();
  const [data, setData] = useState<T[]>(receivedData);
  const [onlyActive, setOnlyActive] = useState<boolean>(true);

  useEffect(() => {
    setData(receivedData);
  }, [receivedData]);

  const triggerIcons = (disabled: boolean) => ({
    toggle: disabled ? "Attiva" : "Disattiva",
    update: <Pencil size={24} className="hover:cursor-pointer" />,
    add: <Plus size={24} className="hover:cursor-pointer" />,
    delete: <Trash size={24} className="hover:cursor-pointer" />,
  });

  const handleToggle = (objectToToggle: T) =>
    fetchRequest<T>("PATCH", path, fetchActions.toggle, {
      id: objectToToggle.id,
    }).then(() => {
      setData((prevData) =>
        prevData.map((item) =>
          item.id === objectToToggle.id
            ? { ...objectToToggle, active: !objectToToggle.active }
            : item
        )
      );

      toastSuccess(
        <>L'elemento è stato {objectToToggle.active ? "disattivato" : "attivato"} correttamente</>
      );
    });

  const handleUpdate = (newValues: Partial<T>, objectToUpdate: T) =>
    fetchRequest<T>("PATCH", path, fetchActions.update, {
      [type]: {
        id: objectToUpdate.id,
        ...newValues,
      },
    }).then((updatedObject) => {
      if (!updatedObject) {
        return toastError("Qualcosa è andato storto");
      }

      setData((prevData) => prevData.map((el) => (el === objectToUpdate ? updatedObject : el)));
      toastSuccess("L'elemento è stato modificato correttamente");
    });

  const handleAdd = (values: Partial<T>) => {
    fetchRequest<T>("POST", path, fetchActions.add, { [type]: { ...values, active: true } }).then(
      (newObject) => {
        if (!newObject) {
          return toastError("Questo elemento esiste già");
        }

        setData((prevData) => [...prevData, newObject]);
        toastSuccess("Elemento aggiunto correttamente");
      }
    );
  };

  const handleDelete = (objectToDelete: T) => {
    if (!deleteAction || !fetchActions.delete) return;

    fetchRequest<T>("DELETE", path, fetchActions.delete, {
      id: objectToDelete.id,
    }).then((response) => {
      if (!response) {
        return toastError("Impossibile eliminare l'elemento");
      }

      setData((prevData) => prevData.filter((item) => item.id !== objectToDelete.id));
      toastSuccess("Elemento eliminato correttamente");
    });
  };

  const getTrigger = (
    action: "toggle" | "update" | "add" | "delete",
    disabled: boolean = false
  ) => (
    <Button type="button" variant={action == "delete" ? "destructive" : "default"}>
      {triggerIcons(disabled)[action]}
    </Button>
  );

  const actions = {
    edit: ({ object }: { object: T }) => (
      <DialogWrapper size="medium" title="Modifica elemento" trigger={getTrigger("update")}>
        <FormFields
          object={object}
          handleSubmit={(values) => handleUpdate(values, object)}
          footerName="Modifica"
        />
      </DialogWrapper>
    ),
    toggle: ({ object }: { object: T }) => (
      <DialogWrapper
        size="small"
        title="Attenzione!"
        trigger={getTrigger("toggle", !object.active)}
        variant="delete"
        onDelete={() => handleToggle(object)}
      >
        <div>
          Stai per <b>{object.active ? "disattivare" : "attivare"}</b> questo elemento. Sei sicuro?
        </div>
      </DialogWrapper>
    ),
    add: (
      <DialogWrapper size="medium" title="Aggiungi elemento" trigger={getTrigger("add")}>
        <FormFields handleSubmit={handleAdd} footerName="Aggiungi" />
      </DialogWrapper>
    ),
    delete: ({ object }: { object: T }) => (
      <DialogWrapper
        variant="delete"
        title="Elimina elemento"
        trigger={getTrigger("delete")}
        onDelete={() => handleDelete(object)}
      >
        Stai per eliminare questo elemento permanentemente. Sei sicuro?
      </DialogWrapper>
    ),
  };

  const tableColumns = getColumns<T>(
    columns,
    actions.edit,
    actions.toggle,
    deleteAction ? actions.delete : undefined
  );
  const table = getTable({
    data: onlyActive ? data.filter((item) => item.active) : data,
    columns: tableColumns,
    globalFilter,
    setGlobalFilter,
    pagination: pagination ? { putPagination: pagination, pageSize: 10 } : undefined,
  });

  return (
    <div className="w-full flex flex-col gap-4">
      <TableControls
        resetClassName="ml-auto"
        table={table}
        AddComponent={actions.add}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        onReset={() => setOnlyActive(true)}
      >
        <div className="space-x-4 flex items-center ">
          {addionalFilters &&
            addionalFilters?.length > 0 &&
            addionalFilters?.map((filter) => filter)}

          <Checkbox
            checked={onlyActive}
            onCheckedChange={() => {
              setOnlyActive(!onlyActive);
            }}
          />
          <Label className="text-xl flex flex-1 items-center h-10 w-full">Solo attivi?</Label>
        </div>
      </TableControls>

      <Table<T> table={table} />

      {pagination ? (
        <TablePagination
          table={table}
          totalCount={table.getFilteredRowModel().rows.length + " elementi totali"}
        />
      ) : (
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} elementi totali
        </div>
      )}
    </div>
  );
}
