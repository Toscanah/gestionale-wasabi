import { useEffect, useState } from "react";
import DialogWrapper from "../components/dialog/DialogWrapper";
import { SidebarMenuSubButton } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "@phosphor-icons/react";

export default function RiceDefaultValues() {
  const [newDefault, setNewDefault] = useState<number>();
  const [riceDefaults, setRiceDefaults] = useState<number[]>([]);

  useEffect(() => {
    const defaults = localStorage.getItem("riceDefaults");
    if (defaults) {
      setRiceDefaults(JSON.parse(defaults) as number[]);
    } else {
      localStorage.setItem("riceDefaults", JSON.stringify([]));
    }
  }, []);

  const addDefaultValue = (value: number | undefined) => {
    if (value === undefined || value <= 0 || riceDefaults.includes(value)) return;
    const updatedDefaults = [...riceDefaults, value];
    setRiceDefaults(updatedDefaults);
    localStorage.setItem("riceDefaults", JSON.stringify(updatedDefaults));
    setNewDefault(undefined); // Clear input
  };

  const removeDefaultValue = (value: number) => {
    const updatedDefaults = riceDefaults.filter((defaultValue) => defaultValue !== value);
    setRiceDefaults(updatedDefaults);
    localStorage.setItem("riceDefaults", JSON.stringify(updatedDefaults));
  };

  return (
    <DialogWrapper
      title="Valori di default del riso"
      hasHeader={true}
      trigger={
        <SidebarMenuSubButton className="hover:cursor-pointer">
          Valori di default
        </SidebarMenuSubButton>
      }
    >
      <div className="flex flex-wrap gap-4 justify-between items-center max-w-[30vw] w-[30vw]">
        {riceDefaults.map((defaultValue) => (
          <Button className="flex items-center gap-2 w grow group" key={defaultValue}>
            <X
              onClick={() => removeDefaultValue(defaultValue)}
              size={24}
              className="transform transition-transform duration-300 
                        group-hover:rotate-[360deg] hover:font-bold hover:drop-shadow-2xl"
            />
            {defaultValue}
          </Button>
        ))}
      </div>
      <div className="w-full flex gap-2">
        <Input
          type="number"
          placeholder="Aggiungi valore"
          value={newDefault || ""}
          onChange={(e) => setNewDefault(parseFloat(e.target.value))}
        />
        <Button onClick={() => addDefaultValue(newDefault)}>Aggiungi</Button>
      </div>
    </DialogWrapper>
  );
}
