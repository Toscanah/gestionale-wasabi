import { ActionColumn, IndexColumn, ValueColumn } from "@/app/(site)/components/table/TableColumns";
import { RFMDimension, RFMRangeRule } from "@/app/(site)/lib/shared/types/RFM";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash } from "@phosphor-icons/react";
import { ColumnDef } from "@tanstack/react-table";
import { RFMTableMeta } from "./RFMDimensionEditor";

const getRfmLabel = (dimension: RFMDimension, value: number | null | undefined) => {
  switch (dimension) {
    case "recency":
      return value === 1 ? "giorno" : "giorni";
    case "frequency":
      return value === 1 ? "volta al mese" : "volte al mese";
    case "monetary":
      return value === 1 ? "euro" : "euro"; // euro is invariant
    default:
      return "";
  }
};

export default function columns(dimension: RFMDimension): ColumnDef<RFMRangeRule>[] {
  return [
    IndexColumn({}),

    ValueColumn({
      header: "Regola",
      accessor: (rule) => rule.min + " " + rule.max,
      value: (row, meta) => {
        const label = getRfmLabel(dimension, row.original.max ?? row.original.min);

        return (
          <div className="flex gap-4 items-center w-full">
            <span>Da</span>

            <Input
              type="number"
              value={row.original.min}
              onChange={(e) =>
                (meta as RFMTableMeta).updateCell(
                  row.index,
                  "min",
                  e.target.value === "" ? "" : parseInt(e.target.value)
                )
              }
              className="w-[4.5rem] text-center"
              placeholder="min"
            />

            <span>a</span>

            <Input
              type="number"
              value={row.original.max ?? ""}
              onChange={(e) =>
                (meta as RFMTableMeta).updateCell(
                  row.index,
                  "max",
                  e.target.value === "" ? "" : parseInt(e.target.value)
                )
              }
              className="w-[4.5rem] text-center"
              placeholder="max"
            />

            <span>{label}</span>
          </div>
        );
      },
    }),

    ValueColumn({
      header: "Punti",
      value: (row, meta) => (
        <Input
          type="number"
          value={row.original.points}
          onChange={(e) =>
            (meta as RFMTableMeta).updateCell(
              row.index,
              "points",
              e.target.value === "" ? "" : parseInt(e.target.value)
            )
          }
          className="w-16"
          placeholder="points"
        />
      ),
      accessor: (rule) => rule.points,
    }),

    ActionColumn({
      action: (row, meta) => (
        <Button
          variant="destructive"
          size="icon"
          onClick={() => (meta as RFMTableMeta).removeRule(row.index)}
        >
          <Trash size={24} />
        </Button>
      ),
    }),
  ];
}
