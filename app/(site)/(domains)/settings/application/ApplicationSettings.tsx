import { useWasabiContext } from "@/context/WasabiContext";
import useFocusOnClick from "@/hooks/focus/useFocusOnClick";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PrinterChoice from "./PrinterChoice";
import { Checkbox } from "@/components/ui/checkbox";

export default function ApplicationSettings() {
  const { settings, updateSettings } = useWasabiContext();
  useFocusOnClick(["when-selector-gap"]);

  return (
    <>
      <div className="flex gap-6">
        <div className="space-y-2 w-full">
          <PrinterChoice />
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
            value={settings.application.whenSelectorGap}
            onChange={(e) =>
              updateSettings("application.whenSelectorGap", e.target.valueAsNumber)
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
            checked={settings.application.whatsapp.active}
            onCheckedChange={(checked) =>
              updateSettings("application.whatsapp", { ...settings.application.whatsapp, active: Boolean(checked) })
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
            disabled={!settings.application.whatsapp.active}
            checked={settings.application.whatsapp.sendOrderConf}
            onCheckedChange={(checked) =>
              updateSettings("application.whatsapp", {
                ...settings.application.whatsapp,
                sendOrderConf: Boolean(checked),
              })
            }
          />
          <Label htmlFor="send-whatsapp-confirmation" className="cursor-pointer">
            Manda il messaggio di conferma ordine in automatico
          </Label>
        </div>
      </div>
    </>
  );
}
