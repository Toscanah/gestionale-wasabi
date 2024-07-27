import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Pencil } from "@phosphor-icons/react";
import { FormValues } from "../../components/forms/getProductForm";
import ProductFields from "../ProductFields";
import { ProductWithInfo } from "../../types/ProductWithInfo";
import fetchRequest from "../../util/fetchRequest";
import { toast } from "sonner";
import { ReactNode } from "react";

export default function EditProduct({
  trigger,
  product,
  onEdit,
}: {
  trigger?: ReactNode;
  product: ProductWithInfo;
  onEdit: (editedProduct: ProductWithInfo) => void;
}) {
  function onSubmit(values: FormValues) {
    fetchRequest<ProductWithInfo>("POST", "/api/products/", "editProduct", {
      id: product.id,
      ...values,
    }).then((product) => {
      if (product) {
        toast.success("Successo", {
          description: "Il prodotto è stato modificato correttamente",
        });
        onEdit(product);
      } else {
        toast.error("Errore", {
          description: "Qualcosa è andato storto",
        });
      }
    });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Pencil size={24} className="hover:cursor-pointer" />
        )}
      </DialogTrigger>
      <DialogContent
        className="max-w-screen w-[40vw]"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="mb-4">Modifica prodotto</DialogTitle>
          <ProductFields
            onSubmit={onSubmit}
            footerName="Modifica"
            productValues={{
              ...product,
              category: String(product.category_id),
            }}
          />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
