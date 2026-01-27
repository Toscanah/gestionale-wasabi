import { Button } from "@/components/ui/button";
import WasabiDialog from "@/components/shared/wasabi/WasabiDialog";
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
    <div className="flex flex-col gap-4">
      <span className="text-lg">
        Stai per eliminare {type === "single" ? "questo ordine." : "gli ordini selezionati."} Questa
        azione è finale e non reversibile.
      </span>

      <Label className="hover:bg-accent/50 text-lg flex items-center gap-4 rounded-lg border p-4 has-[[aria-checked=true]]:border-warning-600 has-[[aria-checked=true]]:bg-warning-50 ">
        <Checkbox
          id="toggle-2"
          checked={productsCooked}
          onCheckedChange={(e) => setProductsCooked(!!e)}
          className="data-[state=checked]:border-warning-500 data-[state=checked]:bg-warning-600 data-[state=checked]:text-white"
        />
        <p className="font-medium">Ho cucinato i prodotti di questo ordine</p>
      </Label>
    </div>
  );

  return (
    <WasabiDialog
      title="Conferma eliminazione ordine"
      putSeparator
      onOpenChange={() => setProductsCooked(false)}
      footerClassName="gap-4"
      contentClassName="p-4"
      size="medium"
      variant="delete"
      triggerClassName="flex-1"
      trigger={DialogTrigger}
      onDelete={() => onDelete(productsCooked)}
    >
      <DialogContent />
    </WasabiDialog>
  );
}
