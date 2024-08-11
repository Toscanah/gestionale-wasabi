"use client";

import { ComponentType, useState } from "react";
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

interface ManagerProps<T> {
  receivedData: T[];
  onObjectDelete: (objectToDelete: T) => void;
  onObjectUpdate: (newValues: Partial<T>, objectToUpdate: T) => Promise<T>;
  onObjectAdd: (values: Partial<T>) => Promise<T>;
  FormFields: ComponentType<FormFieldsProps<T>>;
  columns: ColumnDef<T>[];
}

interface FormFieldsProps<T> {
  handleSubmit: (values: Partial<T>) => void;
  footerName: string;
  object?: T;
}

export default function Manager<T>({
  receivedData,
  onObjectAdd,
  onObjectDelete,
  onObjectUpdate,
  columns,
  FormFields,
}: ManagerProps<T>) {
  const [globalFilter, setGlobalFilter] = useGlobalFilter();
  const [data, setData] = useState<T[]>(receivedData);

  const triggerIcons = {
    delete: <Trash size={24} className="hover:cursor-pointer" />,
    edit: <Pencil size={24} className="hover:cursor-pointer" />,
    add: (
      <>
        <Plus size={24} className="hover:cursor-pointer mr-2" /> Aggiungi prodotto
      </>
    ),
  };

  const handleDelete = (objectToDelete: T) => {
    onObjectDelete(objectToDelete);
    setData((prevData) => prevData.filter((item) => item !== objectToDelete));
  };

  const handleUpdate = (newValues: Partial<T>, objectToUpdate: T) => {
    onObjectUpdate(newValues, objectToUpdate).then((updatedObject) => {
      if (!updatedObject) {
        return toastError("Qualcosa è andato storto", "Errore");
      }

      setData((prevData) => prevData.map((el) => (el === objectToUpdate ? updatedObject : el)));
      toastSuccess("L'elemento è stato modificato correttamente", "Successo");
    });
  };

  const handleAdd = (values: Partial<T>) => {
    onObjectAdd(values).then((newObject) => {
      if (!newObject) {
        return toastError("Questo elemento esiste già", "Errore");
      }

      setData((prevData) => [...prevData, newObject]);
      toastSuccess("Elemento aggiunto correttamente", "Successo");
    });
  };

  const getTrigger = (action: keyof typeof triggerIcons) => (
    <Button type="button">{triggerIcons[action]}</Button>
  );

  const actions = {
    edit: ({ object }: { object: T }) => (
      <DialogWrapper title="Modifica prodotto" trigger={getTrigger("edit")} variant="delete">
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
        trigger={getTrigger("delete")}
        variant="delete"
        onDelete={() => handleDelete(object)}
      >
        <div>Stai per eliminare questo elemento. Sei sicuro?</div>
      </DialogWrapper>
    ),
    add: (
      <DialogWrapper title="Aggiungi prodotto" trigger={getTrigger("add")}>
        <FormFields handleSubmit={handleAdd} footerName="Aggiungi" />
      </DialogWrapper>
    ),
  };

  const tableColumns = getColumns(columns, actions.edit, actions.delete);
  const table = getTable({ data, columns: tableColumns, globalFilter, setGlobalFilter });

  return (
    <div className="w-full flex flex-col gap-4">
      <TableControls
        table={table}
        AddComponent={actions.add}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
      />

      <Table<T> table={table} />
    </div>
  );
}
