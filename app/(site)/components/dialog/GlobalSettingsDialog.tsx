import { SidebarMenuButton } from "@/components/ui/sidebar";
import DialogWrapper from "./DialogWrapper";
import { Gear } from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useWasabiContext } from "../../context/WasabiContext";
import useFocusOnClick from "../../hooks/useFocusOnClick";

export default function GlobalSettingsDialog() {
  const { settings, updateSettings } = useWasabiContext();
  useFocusOnClick(["iva", "kitchen-offset", "when-selector-gap"]);

  return (
    <DialogWrapper
      autoFocus={false}
      trigger={
        <SidebarMenuButton>
          <Gear className="h-4 w-4" /> Impostazioni Wasabi
        </SidebarMenuButton>
      }
      contentClassName="flex flex-col gap-6"
    >
      <div className="flex gap-6">
        <div className="space-y-2 w-full">
          <Label htmlFor="iva">Partita IVA</Label>
          <Input
            type="text"
            id="iva"
            value={settings.iva}
            onChange={(iva) => updateSettings("iva", iva.target.value)}
          />
        </div>

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
    </DialogWrapper>
  );
}
