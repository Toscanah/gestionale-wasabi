"use client";

import { ComponentType, useEffect, useState } from "react";
import useGlobalFilter from "../components/hooks/useGlobalFilter";
import { Pencil, Plus, Trash } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import TableControls from "../components/table/TableControls";
import Table from "../components/table/Table";
import DialogWrapper from "../components/dialog/DialogWrapper";
import { ColumnDef } from "@tanstack/react-table";
import getColumns from "./getColumns";
import getTable from "../util/functions/getTable";
import { toastError, toastSuccess } from "../util/toast";
import fetchRequest from "../util/functions/fetchRequest";

import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

enum Actions {
  UPDATE = "update",
  ADD = "add",
  TOGGLE = "toggle",
}

export type ActionsType = {
  [key in Actions]: string;
};

interface ManagerProps<T extends { id: number; active: boolean }> {
  receivedData: T[];
  path: `/api/${string}`;
  fetchActions: ActionsType;
  FormFields: ComponentType<FormFieldsProps<T>>;
  columns: ColumnDef<T>[];
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
}: ManagerProps<T>) {
  const [globalFilter, setGlobalFilter] = useGlobalFilter();
  const [data, setData] = useState<T[]>(receivedData);
  const [onlyActive, setOnlyActive] = useState<boolean>(true);

  const triggerIcons = (disabled: boolean) => {
    return {
      delete: disabled ? "Attiva" : "Disattiva",
      update: <Pencil size={24} className="hover:cursor-pointer" />,
      add: <Plus size={24} className="hover:cursor-pointer" />,
    };
  };

  const handleToggle = (objectToToggle: T) => {
    fetchRequest<T>("POST", path, fetchActions.toggle, {
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
  };

  const handleUpdate = (newValues: Partial<T>, objectToUpdate: T) => {
    fetchRequest<T>("POST", path, fetchActions.update, {
      id: objectToUpdate.id,
      ...newValues,
    }).then((updatedObject) => {
      if (!updatedObject) {
        return toastError("Qualcosa è andato storto");
      }

      setData((prevData) => prevData.map((el) => (el === objectToUpdate ? updatedObject : el)));
      toastSuccess("L'elemento è stato modificato correttamente");
    });
  };

  const handleAdd = (values: Partial<T>) => {
    fetchRequest<T>("POST", path, fetchActions.add, values).then((newObject) => {
      if (!newObject) {
        return toastError("Questo elemento esiste già");
      }

      setData((prevData) => [...prevData, newObject]);
      toastSuccess("Elemento aggiunto correttamente");
    });
  };

  const getTrigger = (action: "delete" | "update" | "add", disabled: boolean = false) => (
    <Button type="button">{triggerIcons(disabled)[action]}</Button>
  );

  const actions = {
    edit: ({ object }: { object: T }) => (
      <DialogWrapper title="Modifica elemento" trigger={getTrigger("update")} variant="normal">
        <FormFields
          object={object}
          handleSubmit={(values) => handleUpdate(values, object)}
          footerName="Modifica"
        />
      </DialogWrapper>
    ),
    delete: ({ object }: { object: T }) => (
      <DialogWrapper
        title="Attenzione!"
        trigger={getTrigger("delete", !object.active)}
        variant="delete"
        hasHeader
        onDelete={() => handleToggle(object)}
      >
        <div>
          Stai per <b>{object.active ? "disattivare" : "attivare"}</b> questo elemento. Sei sicuro?
        </div>
      </DialogWrapper>
    ),
    add: (
      <DialogWrapper title="Aggiungi elemento" trigger={getTrigger("add")}>
        <FormFields handleSubmit={handleAdd} footerName="Aggiungi" />
      </DialogWrapper>
    ),
  };

  const tableColumns = getColumns<T>(columns, actions.edit, actions.delete);
  const table = getTable({
    data: onlyActive ? data.filter((item) => item.active) : data,
    columns: tableColumns,
    globalFilter,
    setGlobalFilter,
  });

  return (
    <div className="w-full flex flex-col gap-4">
      <TableControls
        table={table}
        AddComponent={actions.add}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        onReset={() => setOnlyActive(true)}
      >
        <div className="space-x-2 flex items-center">
          <Checkbox
            checked={onlyActive}
            onCheckedChange={() => {
              setOnlyActive(!onlyActive);
            }}
          />
          <Label className="text-xl">Solo attivi?</Label>
        </div>
      </TableControls>

      <Table<T> table={table} />

      <div className="flex-1 text-sm text-muted-foreground">
        {table.getFilteredRowModel().rows.length} elementi totali
      </div>
    </div>
  );
}
