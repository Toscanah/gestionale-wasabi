"use client";

import { ComponentType, ReactNode, useMemo, useCallback, useState, useEffect } from "react";
import { Pencil, Plus, Trash } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import TableControls from "../../components/table/TableControls";
import Table from "../../components/table/Table";
import WasabiDialog from "../../components/ui/wasabi/WasabiDialog";
import { ColumnDef } from "@tanstack/react-table";
import getColumns from "./getColumns";
import useTable from "../../hooks/table/useTable";
import { PathType, ValidActionKeys } from "../../lib/api/fetchRequest";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import useManager from "../../hooks/backend/useManager";
import TablePagination from "../../components/table/TablePagination";

export type BaseEntity = { id: number; active: boolean };

export interface FormFieldsProps<T extends BaseEntity> {
  handleSubmit: (values: Partial<T>) => void;
  submitLabel: string;
  object?: T;
}

enum ActionKey {
  UPDATE = "update",
  ADD = "add",
  TOGGLE = "toggle",
  DELETE = "delete",
}

export type BackendActionsMap = Omit<Record<ActionKey, ValidActionKeys>, ActionKey.DELETE> & {
  [ActionKey.DELETE]?: ValidActionKeys;
};

export type EntityType = "product" | "category" | "option" | "customer";

export const MANAGER_LABELS = {
  add: "Aggiungi",
  edit: "Modifica",
  delete: "Elimina",
  confirmDeleteTitle: "Elimina elemento",
  confirmDeleteMsg: "Stai per eliminare questo elemento permanentemente. Sei sicuro?",
  confirmToggleTitle: "Attenzione!",
  onlyActive: "Solo attivi?",
  toggledOn: "attivato",
  toggledOff: "disattivato",
  error: "Qualcosa è andato storto",
  deleteError: "Impossibile eliminare l'elemento",
  editSuccess: "L'elemento è stato modificato correttamente",
  addSuccess: "Elemento aggiunto correttamente",
  deleteSuccess: "Elemento eliminato correttamente",
  exists: "Questo elemento esiste già",
};

interface ManagerProps<T extends BaseEntity> {
  receivedData: T[];
  path: PathType;
  fetchActions: BackendActionsMap;
  FormFields: ComponentType<FormFieldsProps<T>>;
  columns: ColumnDef<T>[];
  type: EntityType;
  additionalFilters?: ReactNode[];
  pagination?: boolean;
  deleteAction?: boolean;
}

export default function Manager<T extends BaseEntity>({
  receivedData,
  path,
  fetchActions,
  columns,
  FormFields,
  type,
  additionalFilters,
  pagination = false,
  deleteAction = false,
}: ManagerProps<T>) {
  const {
    filteredData,
    debouncedQuery,
    inputQuery,
    setInputQuery,
    actions,
    showOnlyActive,
    setShowOnlyActive,
  } = useManager({
    receivedData,
    path,
    fetchActions,
    type,
  });

  const { handleAdd, handleUpdate, handleDelete, handleToggle } = actions;

  const ActionIcons = {
    edit: <Pencil size={20} />,
    add: <Plus size={20} />,
    delete: <Trash size={20} />,
  };

  // Use callbacks for components that depend on props
  const EditAction = useCallback(
    ({ object }: { object: T }) => (
      <WasabiDialog
        size="medium"
        title={`${MANAGER_LABELS.edit} elemento`}
        trigger={<Button type="button">{ActionIcons.edit}</Button>}
      >
        <FormFields
          object={object}
          handleSubmit={(v) => handleUpdate(v, object)}
          submitLabel={MANAGER_LABELS.edit}
        />
      </WasabiDialog>
    ),
    [handleUpdate]
  );

  const ToggleAction = useCallback(
    ({ object }: { object: T }) => (
      <WasabiDialog
        size="small"
        title={MANAGER_LABELS.confirmToggleTitle}
        trigger={
          <Button type="button" variant="default">
            {object.active ? "Disattiva" : "Attiva"}
          </Button>
        }
        variant="delete"
        onDelete={() => handleToggle(object)}
      >
        <div>
          Stai per <b>{object.active ? "disattivare" : "attivare"}</b> questo elemento. Sei sicuro?
        </div>
      </WasabiDialog>
    ),
    [handleToggle]
  );

  const deleteActionFn = useCallback(
    ({ object }: { object: T }) =>
      deleteAction ? (
        <WasabiDialog
          variant="delete"
          title={MANAGER_LABELS.confirmDeleteTitle}
          trigger={
            <Button type="button" variant="destructive">
              {ActionIcons.delete}
            </Button>
          }
          onDelete={() => handleDelete(object)}
        >
          {MANAGER_LABELS.confirmDeleteMsg}
        </WasabiDialog>
      ) : null,
    [handleDelete, deleteAction]
  );

  const AddAction = useMemo(
    () => (
      <WasabiDialog
        size="medium"
        title={`${MANAGER_LABELS.add} elemento`}
        trigger={<Button type="button">{ActionIcons.add}</Button>}
      >
        <FormFields handleSubmit={handleAdd} submitLabel={MANAGER_LABELS.add} />
      </WasabiDialog>
    ),
    [handleAdd]
  );

  const tableColumns = useMemo(
    () =>
      getColumns<T>(columns, EditAction, ToggleAction, deleteAction ? deleteActionFn : undefined),
    [columns, EditAction, ToggleAction, deleteAction, deleteActionFn]
  );

  const table = useMemo(
    () =>
      useTable({
        data: filteredData,
        columns: tableColumns,
        query: inputQuery,
        setQuery: setInputQuery,
        pagination: pagination ? { mode: "client", pageSize: 10 } : undefined,
      }),
    [filteredData, tableColumns, inputQuery, setInputQuery, pagination]
  );

  return (
    <div className="w-full flex flex-col gap-4">
      <TableControls
        resetClassName="ml-auto"
        table={table}
        AddComponent={AddAction}
        globalFilter={inputQuery}
        setGlobalFilter={setInputQuery}
        onReset={() => setShowOnlyActive(true)}
      >
        <div className="space-x-4 flex items-center ">
          {additionalFilters?.map((filter) => filter)}
          <Checkbox
            checked={showOnlyActive}
            onCheckedChange={() => setShowOnlyActive(!showOnlyActive)}
          />
          <Label className="text-xl flex flex-1 items-center h-10 w-full">Solo attivi?</Label>
        </div>
      </TableControls>

      <Table<T> table={table} />

      {pagination ? (
        <TablePagination
          table={table}
          totalCount={`${table.getFilteredRowModel().rows.length} elementi totali`}
        />
      ) : (
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} elementi totali
        </div>
      )}
    </div>
  );
}
