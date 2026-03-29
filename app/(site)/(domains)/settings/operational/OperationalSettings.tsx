import { useWasabiContext } from "@/context/WasabiContext";
import useFocusOnClick from "@/hooks/focus/useFocusOnClick";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function OperationalSettings() {
  const { settings, updateSettings } = useWasabiContext();
  useFocusOnClick(["kitchen-offset", "riders-count", "safe-capacity", "max-capacity"]);

  return (
    <>
      <div className="flex gap-6">
        <div className="space-y-2 w-full">
          <Label htmlFor="kitchen-offset" className="cursor-pointer">
            Anticipo cucina
          </Label>
          <Input
            type="number"
            id="kitchen-offset"
            value={settings.operational.kitchen.offset}
            onChange={(e) =>
              updateSettings("operational.kitchen", {
                ...settings.operational.kitchen,
                offset: e.target.valueAsNumber,
              })
            }
          />
        </div>
        <div className="space-y-2 w-full">
          <Label htmlFor="safe-capacity" className="cursor-pointer">
            Capacità cucina base
          </Label>
          <Input
            type="number"
            id="safe-capacity"
            value={settings.operational.kitchen.safeCapacity}
            onChange={(e) =>
              updateSettings("operational.kitchen", {
                ...settings.operational.kitchen,
                safeCapacity: e.target.valueAsNumber,
              })
            }
          />
        </div>
        <div className="space-y-2 w-full">
          <Label htmlFor="max-capacity" className="cursor-pointer">
            Capacità cucina massima
          </Label>
          <Input
            type="number"
            id="max-capacity"
            value={settings.operational.kitchen.maxCapacity}
            onChange={(e) =>
              updateSettings("operational.kitchen", {
                ...settings.operational.kitchen,
                maxCapacity: e.target.valueAsNumber,
              })
            }
          />
        </div>
      </div>

      <div className="flex gap-6">
        <div className="space-y-2 w-full">
          <Label htmlFor="riders-count" className="cursor-pointer">
            Numero fattorini
          </Label>
          <Input
            type="number"
            id="riders-count"
            value={settings.operational.riders.count}
            onChange={(e) =>
              updateSettings("operational.riders", {
                ...settings.operational.riders,
                count: e.target.valueAsNumber,
              })
            }
          />
        </div>
        <div className="space-y-2 w-full">
          <Label htmlFor="riders-avg" className="cursor-pointer">
            Media ordini/ora per fattorino
          </Label>
          <Input
            type="number"
            id="riders-avg"
            value={settings.operational.riders.avgPerHour}
            onChange={(e) =>
              updateSettings("operational.riders", {
                ...settings.operational.riders,
                avgPerHour: e.target.valueAsNumber,
              })
            }
          />
        </div>
      </div>

      <div className="flex gap-6">
        <div className="space-y-2 w-full">
          <Label htmlFor="prep-time" className="cursor-pointer">
            Tempo medio preparazione ordine
          </Label>
          <Input
            type="number"
            id="prep-time"
            value={settings.operational.timings.standardPrepTime}
            onChange={(e) =>
              updateSettings("operational.timings", {
                ...settings.operational.timings,
                standardPrepTime: e.target.valueAsNumber,
              })
            }
          />
        </div>
        <div className="space-y-2 w-full">
          <Label htmlFor="delivery-time" className="cursor-pointer">
            Tempo medio di consegna
          </Label>
          <Input
            type="number"
            id="delivery-time"
            value={settings.operational.timings.standardDeliveryTime}
            onChange={(e) =>
              updateSettings("operational.timings", {
                ...settings.operational.timings,
                standardDeliveryTime: e.target.valueAsNumber,
              })
            }
          />
        </div>
      </div>
    </>
  );
}
