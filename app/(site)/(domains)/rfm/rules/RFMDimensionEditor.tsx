import { useEffect, useMemo, useState } from "react";
import { debounce } from "lodash";
import { RFMDimensionConfig, RFMRangeRule, RFMDimension } from "@/lib/shared/types/RFM";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "@phosphor-icons/react";
import useTable from "@/hooks/table/useTable";
import columns from "./columns";
import Table from "@/components/table/Table";
import { Label } from "@/components/ui/label";
import { toastError } from "@/lib/shared/utils/global/toast";

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
  const [localRules, setLocalRules] = useState<RFMRangeRule[]>(config.rules);

  useEffect(() => {
    setLocalRules(config.rules);
  }, [config.rules]);

  const debouncedValidate = useMemo(
    () =>
      debounce((nextRules: RFMRangeRule[], index: number) => {
        const curr = nextRules[index];

        // basic checks moved here
        // if (curr.min < 0) {
        //   setLocalRules(config.rules);
        //   toastError("Il valore minimo non può essere negativo.");
        //   return;
        // }
        // if (curr.max !== undefined && curr.min > curr.max) {
        //   setLocalRules(config.rules);
        //   toastError("Il massimo deve essere ≥ del minimo.");
        //   return;
        // }

        // overlap check
        // if (hasOverlap(nextRules, index)) {
        //   setLocalRules(config.rules);
        //   toastError("Il valore inserito sovrappone le regole esistenti.");
        //   return;
        // }

        onUpdateRules(dimensionKey, nextRules);
      }, 500),
    [dimensionKey, onUpdateRules, config.rules]
  );

  const hasOverlap = (rules: RFMRangeRule[], changedIndex: number) => {
    const curr = rules[changedIndex];
    const aMin = curr.min;
    const aMax = curr.max ?? Infinity;

    return rules.some((r, i) => {
      if (i === changedIndex) return false;
      const bMin = r.min;
      const bMax = r.max ?? Infinity;
      return aMin <= bMax && aMax >= bMin;
    });
  };

  const addRule = () => {
    const next = [...localRules, { min: 0, max: undefined, points: 0 }];
    setLocalRules(next);
    onUpdateRules(dimensionKey, next);
  };

  const updateDimensionRule = (index: number, patch: Partial<RFMRangeRule>) => {
    const next = [...localRules];
    const current = { ...next[index], ...patch };

    // no clamping here — allow temporary invalid while typing
    next[index] = current;

    setLocalRules(next);
    debouncedValidate(next, index);
  };

  const removeRule = (index: number) => {
    const next = localRules.filter((_, i) => i !== index);
    setLocalRules(next);
    onUpdateRules(dimensionKey, next);
  };

  const cols = useMemo(() => columns(dimensionKey), [dimensionKey]);

  const table = useTable<RFMRangeRule, RFMTableMeta>({
    data: localRules,
    columns: cols,
    meta: {
      updateCell: (rowIndex, columnId, value) => {
        if (columnId === "min" || columnId === "max" || columnId === "points") {
          updateDimensionRule(rowIndex, {
            [columnId]: value === "" ? undefined : Number(value), // ✅ Number handles floats fine
          });
        }
      },
      removeRule,
    },
  });

  return (
    <div className="flex flex-col gap-4">
      <Table table={table} />

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

        <Button onClick={addRule} variant="default">
          <Plus size={16} /> Aggiungi regola
        </Button>
      </div>
    </div>
  );
}
