import { Button } from "@/components/ui/button";
import DialogWrapper from "../../../../components/ui/dialog/DialogWrapper";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ReactNode, useState } from "react";

interface OrderDeletionDialogProps {
  onDelete: (productsCooked: boolean) => Promise<any> | void;
  type: "single" | "bulk";
  trigger?: ReactNode;
}

export default function OrderDeletionDialog({ onDelete, type, trigger }: OrderDeletionDialogProps) {
  const [productsCooked, setProductsCooked] = useState<boolean>(false);

  const DefaultTrigger = (
    <Button className="w-full flex-1 h-12 text-xl" variant={"destructive"}>
      Elimina ordine
    </Button>
  );

  const DialogTrigger = trigger || DefaultTrigger;

  const DialogContent = () => (
    <div className="space-y-2">
      <span className="text-lg">
        Stai per eliminare {type === "single" ? "questo ordine." : "gli ordini selezionati."} Questa
        azione è finale e non reversibile.
      </span>

      <div className="flex gap-2 items-center">
        <Label className="text-lg font-normal">Ho cucinato i prodotti di questo ordine</Label>
        <Checkbox checked={productsCooked} onCheckedChange={(e) => setProductsCooked(!!e)} />
      </div>
    </div>
  );

  return (
    <DialogWrapper
      size="medium"
      variant="delete"
      triggerClassName="flex-1"
      trigger={DialogTrigger}
      onDelete={() => onDelete(productsCooked)}
    >
      <DialogContent />
    </DialogWrapper>
  );
}
