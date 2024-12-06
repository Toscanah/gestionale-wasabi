import { Button } from "@/components/ui/button";
import { useOrderPaymentContext } from "@/app/(site)/context/OrderPaymentContext";
import ManualInput from "./input-tools/ManualInput";
import CalculationTable from "./input-tools/CalculationTable";
import { ArrowsClockwise } from "@phosphor-icons/react";

export default function Tools() {
  const { setActiveTool, activeTool } = useOrderPaymentContext();

  const toggleTool = () =>
    setActiveTool((prevTool) => (prevTool === "manual" ? "table" : "manual"));

  const toggleLabel = activeTool === "manual" ? "Calcola" : "Manuale";

  return (
    <div className="relative w-full h-full flex flex-col justify-between items-center">
      {activeTool === "manual" ? <ManualInput /> : <CalculationTable />}

      <Button variant="outline" className="h-12 w-full" onClick={toggleTool}>
        {toggleLabel}
        {/* <ArrowsClockwise size={32} /> */}
      </Button>
    </div>
  );
}
