import { useWasabiContext } from "@/app/(site)/context/WasabiContext";
import useFocusOnClick from "@/app/(site)/hooks/focus/useFocusOnClick";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PrinterChoice from "./PrinterChoice";
import TimeWindowFilter from "../../../components/ui/filters/time/TimeWindowFilter";
import { Checkbox } from "@/components/ui/checkbox";

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
          <Label htmlFor="kitchen-offset" className="cursor-pointer">
            Anticipo cucina
          </Label>
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
          <Label htmlFor="when-selector-gap" className="cursor-pointer">
            Intervallo orario (minuti)
          </Label>
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
          <Label htmlFor="riders-count" className="cursor-pointer">
            Numero riders
          </Label>
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

      <div className="space-y-2 w-full">
        <Label htmlFor="use-whatsapp" className="cursor-pointer">
          Integrazione WhatsApp - Meta
        </Label>

        <div className="w-full flex items-center gap-2">
          <Checkbox
            id="use-whatsapp"
            checked={settings.whatsapp.active}
            onCheckedChange={(checked) =>
              updateSettings("whatsapp", { ...settings.whatsapp, active: Boolean(checked) })
            }
          />
          <Label htmlFor="use-whatsapp" className="cursor-pointer">
            Attiva invio messaggi WhatsApp automatici
          </Label>
        </div>

        <div className=" w-full flex items-center gap-2">
          <span>└─</span>
          <Checkbox
            id="send-whatsapp-confirmation"
            disabled={!settings.whatsapp.active}
            checked={settings.whatsapp.sendOrderConf}
            onCheckedChange={(checked) =>
              updateSettings("whatsapp", {
                ...settings.whatsapp,
                sendConfirmation: Boolean(checked),
              })
            }
          />
          <Label htmlFor="send-whatsapp-confirmation" className="cursor-pointer">
            Manda il messaggio di conferma ordine in automatico
          </Label>
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
