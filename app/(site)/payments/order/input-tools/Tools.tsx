import { Dispatch, SetStateAction, useState } from "react";
import ManualInput from "./ManualInput";
import CalculationTable from "./CalculationTable";
import { Button } from "@/components/ui/button";

interface ToolsProps {
  typedAmount: string;
  setTypedAmount: Dispatch<SetStateAction<string>>;
}

export default function Tools({ typedAmount, setTypedAmount }: ToolsProps) {
  const [activeTool, setActiveTool] = useState<"manual" | "table">("manual");

  const toggleTool = () =>
    setActiveTool((prevTool) => (prevTool === "manual" ? "table" : "manual"));

  const toggleLabel = activeTool === "manual" ? "Tabella" : "Manuale";

  return (
    <div className="w-full h-full flex flex-col justify-between">
      {activeTool === "manual" ? (
        <ManualInput setTypedAmount={setTypedAmount} typedAmount={typedAmount} />
      ) : (
        <CalculationTable />
      )}

      <Button variant="outline" className="h-20" onClick={toggleTool}>
        {toggleLabel}
      </Button>
    </div>
  );
}
