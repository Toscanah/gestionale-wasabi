import { Button } from "@/components/ui/button";
import DialogWrapper from "./dialog/DialogWrapper";
import { ChefHat, Coffee } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { FormDescription } from "@/components/ui/form";
import { SidebarMenuButton } from "@/components/ui/sidebar";

export default function KitchenOffset() {
  const [offset, setOffset] = useState<number>(0);

  useEffect(() => {
    const currentOffset = localStorage.getItem("kitchenOffset");

    if (currentOffset) {
      setOffset(parseInt(currentOffset, 10));
    } else {
      localStorage.setItem("kitchenOffset", "0");
    }
  }, []);

  return (
    <DialogWrapper
      hasHeader
      title="Anticipo cottura prodotti"
      trigger={
        <SidebarMenuButton>
          <ChefHat className="mr-2 h-4 w-4" /> Cucina
        </SidebarMenuButton>
      }
      footer={
        <DialogClose className="w-full">
          <Button
            className="w-full"
            onClick={() => localStorage.setItem("kitchenOffset", offset.toString())}
          >
            Salva
          </Button>
        </DialogClose>
      }
    >
      <div className="space-y-2">
        <Label>
          Anticipo cottura prodotti <p className="text-muted-foreground inline-block">(minuti)</p>
        </Label>
        <Input onChange={(e) => setOffset(parseInt(e.target.value, 10))} value={offset} />
      </div>
    </DialogWrapper>
  );
}
