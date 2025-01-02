import { Button } from "@/components/ui/button";
import { useOrderPaymentContext } from "@/app/(site)/context/OrderPaymentContext";
import ManualInput from "./input-tools/ManualInput";
import CalculationTable from "./input-tools/CalculationTable";
import { ArrowsClockwise, ToggleLeft, ToggleRight } from "@phosphor-icons/react";
import { ArrowsLeftRight } from "@phosphor-icons/react/dist/ssr";

export default function Tools() {
  const { setActiveTool, activeTool } = useOrderPaymentContext();

  const toggleTool = () =>
    setActiveTool((prevTool) => (prevTool === "manual" ? "table" : "manual"));

  const toggleLabel = activeTool === "manual" ? "Calcola" : "Manuale";

  return (
    <div className="w-full h-full flex flex-col justify-between items-center">
      {activeTool === "manual" ? <ManualInput /> : <CalculationTable />}

      <Button variant="outline" className="h-16 w-16 p-0" onClick={toggleTool}>
        {/* {toggleLabel} */}
        {/* <ArrowsLeftRight size={48}/> */}
        {activeTool == "manual" ? <ToggleRight size={48}/> : <ToggleLeft size={48}/>}
        {/* <ArrowsClockwise size={32} /> */}
      </Button>
    </div>
  );
}
