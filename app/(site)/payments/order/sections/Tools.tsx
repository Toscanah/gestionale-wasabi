import { Button } from "@/components/ui/button";
import { useOrderPaymentContext } from "@/app/(site)/context/OrderPaymentContext";
import ManualInput from "./input-tools/ManualInput";
import CalculationTable from "./input-tools/CalculationTable";

export default function Tools() {
  const { setActiveTool, activeTool } = useOrderPaymentContext();

  const toggleTool = () =>
    setActiveTool((prevTool) => (prevTool === "manual" ? "table" : "manual"));

  const toggleLabel = activeTool === "manual" ? "Calcola" : "Manuale";

  return (
    <div className="w-full h-full flex flex-col justify-between">
      {activeTool === "manual" ? <ManualInput /> : <CalculationTable />}

      <Button variant="outline" className="h-20 text-2xl" onClick={toggleTool}>
        {toggleLabel}
      </Button>
    </div>
  );
}
