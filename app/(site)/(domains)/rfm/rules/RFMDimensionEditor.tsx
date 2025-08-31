// components/RfmDimensionEditor.tsx
import { RFMDimensionConfig, RFMRangeRule, RFMDimension } from "@/app/(site)/lib/shared/types/rfm";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "@phosphor-icons/react";
import useTable from "@/app/(site)/hooks/table/useTable";
import columns from "./columns";
import Table from "@/app/(site)/components/table/Table";
import { useMemo } from "react";
import { Label } from "@/components/ui/label";

export type RFMTableMeta = {
  updateCell: (rowIndex: number, columnId: keyof RFMRangeRule, value: number | "") => void;
  removeRule: (rowIndex: number) => void;
};

type RFMDimensionEditorProps = {
  dimensionKey: RFMDimension;
  config: RFMDimensionConfig;
  onUpdateRules: (dimension: RFMDimension, rules: RFMRangeRule[]) => void;
  onUpdateWeight: (dimension: RFMDimension, weight: number) => void;
};

export default function RFMDimensionEditor({
  dimensionKey,
  config,
  onUpdateRules,
  onUpdateWeight,
}: RFMDimensionEditorProps) {
  const addRule = () => {
    onUpdateRules(dimensionKey, [...config.rules, { min: 0, max: undefined, points: 0 }]);
  };

  const updateDimensionRule = (index: number, patch: Partial<RFMRangeRule>) => {
    const next = [...config.rules];
    const current = { ...next[index], ...patch };

    // --- Validation rules ---
    if (current.max !== undefined && current.min > current.max) {
      current.max = current.min; // clamp so it's never < min
    }
    if (current.min < 0) {
      current.min = 0; // clamp min to non-negative
    }

    next[index] = current;
    onUpdateRules(dimensionKey, next);
  };

  const removeRule = (index: number) => {
    onUpdateRules(
      dimensionKey,
      config.rules.filter((_, i) => i !== index)
    );
  };

  const cols = useMemo(() => columns(dimensionKey), [dimensionKey]);

  const table = useTable<RFMRangeRule, RFMTableMeta>({
    data: config.rules,
    columns: cols,
    meta: {
      updateCell: (rowIndex, columnId, value) => {
        if (columnId === "min" || columnId === "max" || columnId === "points") {
          updateDimensionRule(rowIndex, { [columnId]: value === "" ? undefined : value });
        }
      },
      removeRule,
    },
  });

  return (
    <div className="flex flex-col gap-4">
      {/* Weight input */}

      {/* Rules table */}
      {config.rules.length > 0 ? (
        <Table table={table} />
      ) : (
        <span className="flex w-full items-center justify-center text-muted-foreground">
          Nessuna regola disponibile
        </span>
      )}

      {/* Add new rule */}
      <div className="w-full flex justify-between">
        <div className="flex w-full items-center gap-2">
          <Label htmlFor={`weight-${dimensionKey}`} className="text-sm font-medium">
            Peso:
          </Label>
          <Input
            id={`weight-${dimensionKey}`}
            type="number"
            min={0}
            max={1}
            step={0.1}
            value={config.weight}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              if (isNaN(val)) {
                onUpdateWeight(dimensionKey, 0);
                return;
              }

              onUpdateWeight(dimensionKey, Math.min(1, Math.max(0, val)));
            }}
            className="w-24"
          />
        </div>

        <Button onClick={addRule} variant="default" size="sm" className="">
          <Plus size={16} className="mr-1" /> Aggiungi regola
        </Button>
      </div>
    </div>
  );
}
