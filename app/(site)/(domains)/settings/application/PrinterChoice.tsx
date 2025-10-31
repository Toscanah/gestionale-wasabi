import { useWasabiContext } from "@/app/(site)/context/WasabiContext";
import { Label } from "@/components/ui/label";
import WasabiSelect from "@/app/(site)/components/ui/wasabi/WasabiSelect";

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
      <Label htmlFor="printer" className="cursor-pointer">
        Stampante
      </Label>
      <WasabiSelect
        appearance="form"
        searchPlaceholder="Cerca stampante"
        mode="single"
        id="printer"
        triggerClassName="h-10"
        selectedValue={settings.selectedPrinter.name}
        onChange={(printerName) => {
          const selectedPrinter = PREDEFINED_PRINTERS.find(
            (printer) => printer.name === printerName
          );
          if (selectedPrinter) {
            updateSettings("selectedPrinter", selectedPrinter);
          }
        }}
        groups={[
          {
            options: PREDEFINED_PRINTERS.map((printer) => ({
              value: printer.name,
              label: printer.name,
            })),
          },
        ]}
      />
    </>
  );
}
