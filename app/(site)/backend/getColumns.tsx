import React, { ComponentType } from "react";
import { ColumnDef } from "@tanstack/react-table";
import TableColumn from "../components/table/TableColumn";
import { Check, X } from "@phosphor-icons/react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

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
      cellContent: (row) => (
        <Badge
          //variant={row.original.active ? "default" : "destructive"}
          className={cn(
            row.original.active
              ? "dark:bg-successGreen-dark bg-successGreen-light text-foreground"
              : "bg-destructive"
          )}
        >
          {row.original.active ? "Attivo" : "Non attivo"}
        </Badge>
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
