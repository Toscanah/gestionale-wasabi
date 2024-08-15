import React, { ComponentType } from "react";
import { ColumnDef } from "@tanstack/react-table";
import TableColumn from "../components/table/TableColumn";
import { Check, X } from "@phosphor-icons/react";

export default function getColumns<T extends { id: number; active: boolean }>(
  columns: ColumnDef<T>[],
  EditComponent: ComponentType<{ object: T }>,
  DeleteComponent: ComponentType<{ object: T }>
): ColumnDef<T>[] {
  const baseColumns = [
    ...columns,

    TableColumn<T>({
      accessorKey: "active",
      header: "Attivo?",
      cellContent: (row) =>
        row.original.active == true ? (
          <Check className="text-lime-500 h-6 w-6" />
        ) : (
          <X className="text-red-600 h-6 w-6" />
        ),
    }),

    TableColumn<T>({
      accessorKey: "actions",
      header: "Azioni",
      cellContent: (row) => (
        <div className="flex space-x-2">
          {React.createElement(EditComponent, { object: row.original })}
          {React.createElement(DeleteComponent, { object: row.original })}
        </div>
      ),
    }),
  ];

  return baseColumns;
}
