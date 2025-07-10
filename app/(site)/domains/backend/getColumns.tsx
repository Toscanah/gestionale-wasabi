import React, { ComponentType } from "react";
import { ColumnDef } from "@tanstack/react-table";
import TableColumn from "../../components/table/TableColumn";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function getColumns<T extends { id: number; active: boolean }>(
  columns: ColumnDef<T>[],
  EditComponent: ComponentType<{ object: T }>,
  ToggleComponent: ComponentType<{ object: T }>,
  DeleteComponent?: ComponentType<{ object: T }>
): ColumnDef<T>[] {
  const baseColumns = [
    ...columns,

    TableColumn<T>({
      header: "Attivo?",
      cellContent: (row) => (
        <Badge
          //variant={row.original.active ? "default" : "destructive"}
          className={cn(row.original.active ? "bg-green-400 text-foreground" : "bg-destructive")}
        >
          {row.original.active ? "Attivo" : "Non attivo"}
        </Badge>
      ),
    }),

    TableColumn<T>({
      header: "Azioni",
      sortable: false,
      cellContent: (row) => (
        <div className="flex space-x-2">
          {React.createElement(EditComponent, { object: row.original })}
          {React.createElement(ToggleComponent, { object: row.original })}
          {DeleteComponent && React.createElement(DeleteComponent, { object: row.original })}
        </div>
      ),
    }),
  ];

  return baseColumns;
}
