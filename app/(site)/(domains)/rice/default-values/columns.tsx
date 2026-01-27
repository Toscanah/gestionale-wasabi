"use client";

import { ActionColumn, IndexColumn, ValueColumn } from "@/components/table/TableColumns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash } from "@phosphor-icons/react";
import { ColumnDef } from "@tanstack/react-table";
import { RiceDefaultValuesTableMeta } from "./RiceDefaultValues";
import { RiceBatchType } from "@/prisma/generated/schemas";

const columns: ColumnDef<RiceBatchType>[] = [
  IndexColumn({}),

  ValueColumn({
    header: "Etichetta",
    value: (row, meta) => {
      const batch = row.original;
      const { debouncedUpdateBatch } = meta as RiceDefaultValuesTableMeta;

      return (
        <Input
          type="text"
          placeholder="Modifica etichetta"
          defaultValue={batch.label || ""}
          onChange={(e) => debouncedUpdateBatch(batch.id, "label", e.target.value)}
        />
      );
    },
    accessor: (batch) => batch.label,
  }),

  ValueColumn({
    header: "Valore",
    value: (row, meta) => {
      const batch = row.original;
      const { debouncedUpdateBatch } = meta as RiceDefaultValuesTableMeta;

      return (
        <Input
          type="number"
          placeholder="Modifica valore"
          defaultValue={batch.amount}
          onChange={(e) =>
            debouncedUpdateBatch(batch.id, "amount", parseFloat(e.target.value) || 0)
          }
        />
      );
    },
    accessor: (batch) => batch.amount,
  }),

  ActionColumn({
    header: "Elimina",
    action: (row, meta) => {
      const { removeRiceBatch } = meta as RiceDefaultValuesTableMeta;

      return (
        <Button className="group w-full" onClick={() => removeRiceBatch(row.original.id)}>
          <Trash
            size={24}
            className="transform transition-transform duration-300 
                          group-hover:rotate-[360deg] hover:font-bold hover:drop-shadow-2xl"
          />
        </Button>
      );
    },
  }),
];

export default columns;
