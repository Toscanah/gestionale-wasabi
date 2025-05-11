import { useWasabiContext } from "@/app/(site)/context/WasabiContext";
import useFocusOnClick from "@/app/(site)/hooks/useFocusOnClick";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PrinterChoice from "./PrinterChoice";
import TimePicker from "../../components/ui/time/TimePicker";

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

      <div className="flex gap-6">
        <div className="space-y-2 w-full">
          <Label htmlFor="riders-count">Numero riders</Label>
          <Input
            type="number"
            id="riders-count"
            value={settings.riders.count}
            onChange={(count) =>
              updateSettings("riders", { ...settings.riders, count: count.target.valueAsNumber })
            }
          />
        </div>
      </div>

      {/* <div className="flex gap-6">
        <div className="space-y-2 w-full">
          <Label htmlFor="">Primo ordine pranzo</Label>
          <TimePicker
            value={settings.orderProcessingHours.lunch.open}
            onValueChange={(value) =>
              updateSettings("orderProcessingHours", {
                ...settings.orderProcessingHours,
                lunch: { ...settings.orderProcessingHours.lunch, open: value },
              })
            }
          />
        </div>

        <div className="space-y-2 w-full">
          <Label htmlFor="">Ultimo ordine pranzo</Label>
          <TimePicker
            value={settings.orderProcessingHours.lunch.close}
            onValueChange={(value) =>
              updateSettings("orderProcessingHours", {
                ...settings.orderProcessingHours,
                lunch: { ...settings.orderProcessingHours.lunch, close: value },
              })
            }
          />
        </div>

        <div className="space-y-2 w-full">
          <Label htmlFor="">Primo ordine cena</Label>
          <TimePicker
            value={settings.orderProcessingHours.dinner.open}
            onValueChange={(value) =>
              updateSettings("orderProcessingHours", {
                ...settings.orderProcessingHours,
                dinner: { ...settings.orderProcessingHours.dinner, open: value },
              })
            }
          />
        </div>

        <div className="space-y-2 w-full">
          <Label htmlFor="">Ultimo ordine cena</Label>
          <TimePicker
            value={settings.orderProcessingHours.dinner.close}
            onValueChange={(value) =>
              updateSettings("orderProcessingHours", {
                ...settings.orderProcessingHours,
                dinner: { ...settings.orderProcessingHours.dinner, close: value },
              })
            }
          />
        </div>
      </div> */}
    </>
  );
}
