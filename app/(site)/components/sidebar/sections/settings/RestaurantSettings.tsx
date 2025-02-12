import { useWasabiContext } from "@/app/(site)/context/WasabiContext";
import useFocusOnClick from "@/app/(site)/hooks/useFocusOnClick";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const parseAddress = (input: string) => {
  const regex = /^(.+?)\s(\d+\S*)(?:\s(\d+))?$/;
  const match = input.match(regex);

  if (match) {
    return {
      street: match[1],
      civic: match[2],
      cap: match[3] || "", // CAP is optional
    };
  } else {
    return {
      street: input,
      civic: "",
      cap: "",
    };
  }
};

export default function RestaurantSettings() {
  const { settings, updateSettings } = useWasabiContext();
  useFocusOnClick(["address", "name", "slogan", "tel", "cell"]);

  return (
    <>
      <div className="flex gap-6">
        <div className="space-y-2 w-full">
          <Label htmlFor="address">Indirizzo</Label>
          <Input
            type="text"
            id="address"
            defaultValue={`${settings.address.street} ${settings.address.civic} ${settings.address.cap}`}
            onChange={(e) => {
              const parsedAddress = parseAddress(e.target.value);
              updateSettings("address", { ...settings.address, ...parsedAddress });
            }}
          />
        </div>
      </div>

      <div className="flex gap-6">
        <div className="space-y-2 w-full">
          <Label htmlFor="name">Nome</Label>
          <Input
            type="text"
            id="name"
            value={settings.name}
            onChange={(name) => updateSettings("name", name.target.value)}
          />
        </div>

        <div className="space-y-2 w-full">
          <Label htmlFor="slogan">Slogan</Label>
          <Input
            type="text"
            id="slogan"
            value={settings.slogan}
            onChange={(slogan) => updateSettings("slogan", slogan.target.value)}
          />
        </div>
      </div>

      <div className="flex gap-6">
        <div className="space-y-2 w-full">
          <Label htmlFor="tel">Numero di telefono</Label>
          <Input
            type="text"
            id="tel"
            value={settings.telNumber}
            onChange={(telNumber) => updateSettings("telNumber", telNumber.target.value)}
          />
        </div>

        <div className="space-y-2 w-full">
          <Label htmlFor="cell">Cellulare</Label>
          <Input
            type="text"
            id="cellNumber"
            value={settings.cellNumber}
            onChange={(cellNumber) => updateSettings("cellNumber", cellNumber.target.value)}
          />
        </div>
      </div>
    </>
  );
}
