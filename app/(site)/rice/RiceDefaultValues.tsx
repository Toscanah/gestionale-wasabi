import { useEffect, useState } from "react";
import DialogWrapper from "../components/dialog/DialogWrapper";
import { SidebarMenuSubButton } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash, X } from "@phosphor-icons/react";
import { RiceDefault } from "../types/RiceDefault";
import { Separator } from "@/components/ui/separator";

export default function RiceDefaultValues() {
  const [newDefault, setNewDefault] = useState<RiceDefault>();
  const [riceDefaults, setRiceDefaults] = useState<RiceDefault[]>([]);

  useEffect(() => {
    const defaults = localStorage.getItem("riceDefaults");

    if (defaults) {
      setRiceDefaults(JSON.parse(defaults) as RiceDefault[]);
    } else {
      localStorage.setItem("riceDefaults", JSON.stringify([]));
    }
  }, []);

  const addDefaultValue = (riceDefault: RiceDefault | undefined) => {
    if (!riceDefault) return;

    const updatedDefaults = [...riceDefaults, riceDefault];
    setRiceDefaults(updatedDefaults);
    localStorage.setItem("riceDefaults", JSON.stringify(updatedDefaults));
    setNewDefault(undefined);
  };

  const removeDefaultValue = (riceDefault: RiceDefault) => {
    const updatedDefaults = riceDefaults.filter((defaultValue) => defaultValue !== riceDefault);
    setRiceDefaults(updatedDefaults);
    localStorage.setItem("riceDefaults", JSON.stringify(updatedDefaults));
  };

  const updateDefaultValue = (index: number, updatedField: Partial<RiceDefault>) => {
    const updatedDefaults = [...riceDefaults];
    updatedDefaults[index] = { ...updatedDefaults[index], ...updatedField };
    setRiceDefaults(updatedDefaults);
    localStorage.setItem("riceDefaults", JSON.stringify(updatedDefaults));
  };

  return (
    <DialogWrapper
      size="medium"
      title="Valori di default del riso"
      contentClassName="max-w-[30vw] w-[30vw]"
      trigger={
        <SidebarMenuSubButton className="hover:cursor-pointer">
          Valori di default
        </SidebarMenuSubButton>
      }
    >
      {riceDefaults.length > 0 && (
        <div className="flex flex-col gap-2 items-center w-full">
          {riceDefaults.map((riceDefault, index) => (
            <div className="flex items-center gap-2 w-full" key={index}>
              <Input
                className="w-[40%]"
                type="number"
                placeholder="Modifica valore"
                defaultValue={riceDefault.value}
                onChange={(e) => updateDefaultValue(index, { value: parseFloat(e.target.value) })}
              />

              <Input
                className="w-[40%]"
                type="text"
                placeholder="Modifica etichetta"
                value={riceDefault.label || ""}
                onChange={(e) => updateDefaultValue(index, { label: e.target.value })}
              />

              {/* Remove button */}
              <Button className="group w-[20%]">
                <Trash
                  onClick={() => removeDefaultValue(riceDefault)}
                  size={24}
                  className="transform transition-transform duration-300 
                        group-hover:rotate-[360deg] hover:font-bold hover:drop-shadow-2xl"
                />
              </Button>
            </div>
          ))}
        </div>
      )}

      <Separator />
      <div className="w-full flex gap-2">
        <Input
          className="w-[40%]"
          type="number"
          placeholder="Aggiungi valore"
          value={newDefault?.value || ""}
          onChange={(e) =>
            setNewDefault((prevDefault) => ({
              ...prevDefault,
              value: parseFloat(e.target.value) || 0,
            }))
          }
        />
        <Input
          className="w-[40%]"
          type="text"
          placeholder="Aggiungi etichetta"
          value={newDefault?.label || ""}
          onChange={(e) =>
            setNewDefault((prevDefault) =>
              prevDefault
                ? {
                    ...prevDefault,
                    label: e.target.value,
                  }
                : undefined
            )
          }
        />
        <Button
          className="w-[20%]"
          onClick={() => addDefaultValue(newDefault)}
          disabled={!newDefault?.value}
        >
          <Plus size={24} />
        </Button>
      </div>
    </DialogWrapper>
  );
}
