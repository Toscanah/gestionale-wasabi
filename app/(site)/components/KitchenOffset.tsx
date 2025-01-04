import { Button } from "@/components/ui/button";
import DialogWrapper from "./dialog/DialogWrapper";
import { ChefHat, Coffee } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { FormDescription } from "@/components/ui/form";
import { SidebarMenuButton } from "@/components/ui/sidebar";

interface KitchenOffsetProps {
  variant: "sidebar" | "header";
}

export default function KitchenOffset({ variant }: KitchenOffsetProps) {
  const [offset, setOffset] = useState<number>(0);

  useEffect(() => {
    const currentOffset = localStorage.getItem("kitchenOffset");

    if (currentOffset) {
      const parsedOffset = parseInt(currentOffset, 10);
      setOffset(isNaN(parsedOffset) ? 0 : parsedOffset);
    } else {
      localStorage.setItem("kitchenOffset", "0");
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsedValue = parseInt(e.target.value, 10);
    setOffset(isNaN(parsedValue) ? 0 : parsedValue);
  };

  return (
    <DialogWrapper
      size="small"
      contentClassName="border-t-4 border-t-gray-400"
      title="Anticipo cottura prodotti"
      trigger={
        variant == "sidebar" ? (
          <SidebarMenuButton>
            <ChefHat className="h-4 w-4" /> Cucina
          </SidebarMenuButton>
        ) : (
          <Button variant={"outline"} className="w-44">
            <ChefHat className="mr-2 h-4 w-4" />
            Anticipo cucina
          </Button>
        )
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
        <Input onChange={handleInputChange} value={offset} />
      </div>
    </DialogWrapper>
  );
}
