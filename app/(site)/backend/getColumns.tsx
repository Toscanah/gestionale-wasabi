import React, { ComponentType } from "react";
import { ColumnDef } from "@tanstack/react-table";
import TableColumn from "../components/table/TableColumn";

export default function getColumns<T>(
  columns: ColumnDef<T>[],
  EditComponent: ComponentType<{ object: T }>,
  DeleteComponent: ComponentType<{ object: T }>
): ColumnDef<T>[] {
  return [
    ...columns,

    TableColumn({
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
}
