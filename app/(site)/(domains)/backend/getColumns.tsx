import React, { ComponentType } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ActionColumn, ValueColumn } from "../../components/table/TableColumns";

export default function getColumns<T extends { id: number; active: boolean }>(
  columns: ColumnDef<T>[],
  EditComponent: ComponentType<{ object: T }>,
  ToggleComponent: ComponentType<{ object: T }>,
  DeleteComponent?: ComponentType<{ object: T }>
): ColumnDef<T>[] {
  const SafeDeleteComponent = DeleteComponent ?? (() => null);

  const baseColumns = [
    ...columns,

    ValueColumn<T>({
      header: "Attivo?",
      value: (row) => (
        <Badge
          className={cn(row.original.active ? "bg-green-400 text-foreground" : "bg-destructive")}
        >
          {row.original.active ? "Attivo" : "Non attivo"}
        </Badge>
      ),
      accessor: (el) => el.active,
    }),

    ActionColumn<T>({
      header: "Azioni",
      action: (row) => (
        <div className="flex space-x-2">
          {React.createElement(EditComponent, { object: row.original })}
          {React.createElement(ToggleComponent, { object: row.original })}
          {React.createElement(SafeDeleteComponent, { object: row.original })}
        </div>
      ),
    }),
  ];

  return baseColumns;
}
