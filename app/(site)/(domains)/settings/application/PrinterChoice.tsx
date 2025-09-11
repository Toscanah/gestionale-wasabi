import { useWasabiContext } from "@/app/(site)/context/WasabiContext";
import { Label } from "@/components/ui/label";
import WasabiSingleSelect from "../../../components/ui/wasabi/WasabiSingleSelect";

export type Printer = {
  name: "Stampante bianca" | "Stampante nera";
  charSet: "wpc1256_arabic" | "pc858_euro";
};

export const PREDEFINED_PRINTERS: Printer[] = [
  { name: "Stampante nera", charSet: "pc858_euro" },
  { name: "Stampante bianca", charSet: "wpc1256_arabic" },
];

export default function PrinterChoice() {
  const { settings, updateSettings } = useWasabiContext();

  return (
    <>
      <Label htmlFor="printer" className="cursor-pointer">Stampante</Label>
      <WasabiSingleSelect
        id="printer"
        className="h-10"
        value={settings.selectedPrinter.name}
        onValueChange={(printerName) => {
          const selectedPrinter = PREDEFINED_PRINTERS.find(
            (printer) => printer.name === printerName
          );
          if (selectedPrinter) {
            updateSettings("selectedPrinter", selectedPrinter);
          }
        }}
        groups={[
          {
            items: PREDEFINED_PRINTERS.map((printer) => printer.name),
          },
        ]}
      />
    </>
  );
}
