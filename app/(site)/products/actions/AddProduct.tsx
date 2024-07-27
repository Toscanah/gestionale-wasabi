import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "@phosphor-icons/react";
import { FormValues } from "../../components/forms/getProductForm";
import fetchRequest from "../../util/fetchRequest";
import { ProductWithInfo } from "../../types/ProductWithInfo";
import { toast } from "sonner";
import ProductFields from "../ProductFields";

export default function AddProduct({
  onAdd,
}: {
  onAdd: (newProduct: ProductWithInfo) => void;
}) {
  function onSubmit(values: FormValues) {
    fetchRequest<ProductWithInfo>(
      "POST",
      "/api/products/",
      "createProduct",
      values
    ).then((product) => {
      if (product) {
        toast.success("Successo", {
          description: "Il prodotto è stato aggiunto correttamente",
        });
        onAdd(product);
      } else {
        toast.error("Errore", {
          description: "Il prodotto esiste già",
        });
      }
    });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="rounded-full">
          <Plus size={32} className="hover:cursor-pointer" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-screen w-[40vw]">
        <DialogHeader>
          <DialogTitle className="mb-4">Aggiungi prodotto</DialogTitle>
          <ProductFields onSubmit={onSubmit} footerName="Aggiungi" />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
