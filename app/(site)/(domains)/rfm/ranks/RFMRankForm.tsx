import SelectWrapper from "@/app/(site)/components/ui/select/SelectWrapper";
import { RFMDimension, RFMRankRule } from "@/app/(site)/lib/shared/types/RFM";
import capitalizeFirstLetter from "@/app/(site)/lib/utils/global/string/capitalizeFirstLetter";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";

interface RFMRankEditorProps {
  rank: RFMRankRule;
  onChange: (updated: RFMRankRule) => void;
}

type Mode = "between" | "eq";

interface RFMFieldEditorProps {
  label: string;
  dimension: RFMDimension;
  rank: RFMRankRule;
  onChange: (updated: RFMRankRule) => void;
}

function RFMFieldEditor({ label, dimension, rank, onChange }: RFMFieldEditorProps) {
  const parsedDimension = capitalizeFirstLetter(dimension);
  const minKey = `min${parsedDimension}` as keyof Omit<
    RFMRankRule,
    "rank"
  >;
  const maxKey = `max${parsedDimension}` as keyof Omit<
    RFMRankRule,
    "rank"
  >;

  // derive initial mode
  const initialMode: Mode =
    rank[minKey] !== undefined && rank[maxKey] !== undefined
      ? rank[minKey] === rank[maxKey]
        ? "eq"
        : "between"
      : "eq";

  const [mode, setMode] = useState<Mode>(initialMode);
  const [minValue, setMinValue] = useState<string>("");
  const [maxValue, setMaxValue] = useState<string>("");

  // sync with rank
  useEffect(() => {
    const min = rank[minKey];
    const max = rank[maxKey];

    if (mode === "eq") {
      const val = min ?? max;
      setMinValue(val !== undefined ? String(val) : "");
      setMaxValue("");
    } else if (mode === "between") {
      setMinValue(min !== undefined ? String(min) : "");
      setMaxValue(max !== undefined ? String(max) : "");
    }
  }, [rank, mode]);

  const updateRule = (newMin?: number, newMax?: number) => {
    const updated: RFMRankRule = { ...rank };

    if (mode === "eq" && newMin !== undefined) {
      updated[minKey] = newMin as any;
      updated[maxKey] = newMin as any;
    } else if (mode === "between") {
      if (newMin !== undefined) updated[minKey] = newMin as any;
      if (newMax !== undefined) updated[maxKey] = newMax as any;
    }

    onChange(updated);
  };

  const handleModeChange = (newMode: Mode) => {
    setMode(newMode);
    const updated: RFMRankRule = { ...rank };
    delete updated[minKey];
    delete updated[maxKey];

    if (newMode === "eq" && minValue !== "") {
      const num = Number(minValue);
      updated[minKey] = num as any;
      updated[maxKey] = num as any;
    } else if (newMode === "between") {
      if (minValue !== "") updated[minKey] = Number(minValue) as any;
      if (maxValue !== "") updated[maxKey] = Number(maxValue) as any;
    }

    onChange(updated);
  };

  const COMMON_CLASS_NAME = "w-full";

  return (
    <div className="w-full flex items-center gap-4 p-2">
      <strong className="w-4">{label}</strong>

      <div className="w-full flex gap-4 justify-start items-center">
        <SelectWrapper
          id={`dim-${label.toLowerCase()}`}
          value={mode}
          onValueChange={(v) => handleModeChange(v as Mode)}
          className="h-10 w-full"
          groups={[
            {
              items: [
                { name: "compreso tra", value: "between" },
                { name: "uguale a", value: "eq" },
              ],
            },
          ]}
        />
  
        {mode === "eq" ? (
          <>
            <span>=</span>
            <Input
              className={COMMON_CLASS_NAME}
              value={minValue}
              onChange={(e) => {
                setMinValue(e.target.value);
                const num = e.target.value === "" ? undefined : Number(e.target.value);
                if (num !== undefined) updateRule(num, num);
              }}
            />
          </>
        ) : (
          <>
            <span>da</span>
            <Input
              className={COMMON_CLASS_NAME}
              value={minValue}
              onChange={(e) => {
                setMinValue(e.target.value);
                const num = e.target.value === "" ? undefined : Number(e.target.value);
                updateRule(num, maxValue === "" ? undefined : Number(maxValue));
              }}
            />
            <span>a</span>
            <Input
              className={COMMON_CLASS_NAME}
              value={maxValue}
              onChange={(e) => {
                setMaxValue(e.target.value);
                const num = e.target.value === "" ? undefined : Number(e.target.value);
                updateRule(minValue === "" ? undefined : Number(minValue), num);
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}


export default function RFMRankForm({ rank, onChange }: RFMRankEditorProps) {
  return (
    <div className="w-full flex flex-col gap-4">
      <div className="space-y-2">
        <Label htmlFor="rank-name">Nome del rank</Label>
        <Input
          id="rank-name"
          value={rank.rank}
          onChange={(e) => onChange({ ...rank, rank: e.target.value })}
        />
      </div>

      <Separator className="w-full" />

      <RFMFieldEditor label="R" dimension="recency" rank={rank} onChange={onChange} />
      <RFMFieldEditor label="F" dimension="frequency" rank={rank} onChange={onChange} />
      <RFMFieldEditor label="M" dimension="monetary" rank={rank} onChange={onChange} />
    </div>
  );
}
