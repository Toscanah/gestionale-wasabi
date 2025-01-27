import { Label } from "@/components/ui/label";
import { useWasabiContext } from "../../context/WasabiContext";
import SelectWrapper from "../select/SelectWrapper";

export type Printer = {
  name: "Stampante bianca" | "Stampante nera";
  charSet: "wpc1256_arabic" | "pc858_euro";
};

export const predefinedPrinters: Printer[] = [
  { name: "Stampante nera", charSet: "pc858_euro" },
  { name: "Stampante bianca", charSet: "wpc1256_arabic" },
];

export default function PrinterChoice() {
  const { settings, updateSettings } = useWasabiContext();

  return (
    <>
      <Label htmlFor="printer">Stampante</Label>
      <SelectWrapper
        id="printer"
        className="h-10"
        value={settings.selectedPrinter.name}
        onValueChange={(printerName) => {
          const selectedPrinter = predefinedPrinters.find(
            (printer) => printer.name === printerName
          );
          if (selectedPrinter) {
            updateSettings("selectedPrinter", selectedPrinter);
          }
        }}
        groups={[
          {
            items: predefinedPrinters.map((printer) => printer.name),
          },
        ]}
      />
    </>
  );
}
