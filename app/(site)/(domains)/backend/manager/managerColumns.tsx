import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ActionColumn, IndexColumn, ValueColumn } from "../../../components/table/TableColumns";
import { BaseEntity } from "../../../hooks/backend/useManager";
import { ManagerTableMeta } from "./Manager";

const managerColumns = {
  prefix: [
    IndexColumn({}),
    ValueColumn({
      header: "Stato",
      value: (row) => (
        <Badge
          className={cn(
            row.original.active ? "bg-green-400 text-green-950 dark:text-green-950" : "bg-destructive"
          )}
        >
          {row.original.active ? "Attivo" : "Non attivo"}
        </Badge>
      ),
      accessor: (el) => el.active,
    }),
  ] as ColumnDef<BaseEntity>[],
  subfix: [
    ActionColumn({
      header: "Azioni",
      action: (row, meta) => {
        const { EditComponent, ToggleComponent, DeleteComponent } =
          meta as ManagerTableMeta<BaseEntity>;

        return (
          <div className="flex space-x-2 items-center">
            {React.createElement(EditComponent, { object: row.original })}
            {React.createElement(ToggleComponent, { object: row.original })}
            {DeleteComponent && React.createElement(DeleteComponent, { object: row.original })}
          </div>
        );
      },
    }),
  ] as ColumnDef<BaseEntity>[],
};

export default managerColumns;
