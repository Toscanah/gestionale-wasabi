import { useWasabiContext } from "@/app/(site)/context/WasabiContext";
import useFocusOnClick from "@/app/(site)/hooks/useFocusOnClick";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PrinterChoice from "./PrinterChoice";

export default function ApplicationSettings() {
  const { settings, updateSettings } = useWasabiContext();
  useFocusOnClick(["kitchen-offset", "when-selector-gap"]);

  return (
    <>
      <div className="flex gap-6">
        <div className="space-y-2 w-full">
          <PrinterChoice />
        </div>
      </div>

      <div className="flex gap-6">
        <div className="space-y-2 w-full">
          <Label htmlFor="kitchen-offset">Anticipo cucina</Label>
          <Input
            type="number"
            id="kitchen-offset"
            value={settings.kitchenOffset}
            onChange={(kitchenOffset) =>
              updateSettings("kitchenOffset", kitchenOffset.target.valueAsNumber)
            }
          />
        </div>
      </div>

      <div className="flex gap-6">
        <div className="space-y-2 w-full">
          <Label htmlFor="when-selector-gap">Intervallo orario (minuti)</Label>
          <Input
            type="number"
            id="when-selector-gap"
            value={settings.whenSelectorGap}
            onChange={(whenSelectorGap) =>
              updateSettings("whenSelectorGap", whenSelectorGap.target.valueAsNumber)
            }
          />
        </div>
      </div>
    </>
  );
}
