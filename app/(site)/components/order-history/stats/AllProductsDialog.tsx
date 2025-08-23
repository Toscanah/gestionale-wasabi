import { ProductInOrder } from "@/app/(site)/lib/shared";
import DialogWrapper from "../../ui/dialog/DialogWrapper";
import ProductLine from "../common/ProductLine";
import { Button } from "@/components/ui/button";
import getTable from "@/app/(site)/lib/utils/global/getTable";
import productColumns from "../common/productColumns";
import Table from "../../table/Table";

interface AllProductsDialogProps {
  allProducts: ProductInOrder[];
}

function groupProducts(allProducts: ProductInOrder[]): ProductInOrder[] {
  const map = new Map<number, ProductInOrder>();

  for (const p of allProducts) {
    const id = p.product.id;

    if (!map.has(id)) {
      map.set(id, { ...p });
    } else {
      const existing = map.get(id)!;
      existing.quantity += p.quantity;
    }
  }

  return Array.from(map.values());
}

export default function AllProductsDialog({ allProducts }: AllProductsDialogProps) {
  const groupedProducts = groupProducts(allProducts).sort((a, b) => b.quantity - a.quantity);

  const table = getTable({ data: groupedProducts, columns: productColumns(false) });

  return (
    <DialogWrapper
      title="Tutti i prodotti ordinati"
      putSeparator
      size="mediumPlus"
      putUpperBorder
      // contentClassName="max-h-[70vh] overflow-y-auto z-[1000]"
      trigger={<Button className="w-full">Mostra tutti i prodotti</Button>}
    >
      <div className="max-h-[70vh] overflow-y-auto ">
        {groupedProducts.length > 0 ? (
          <Table table={table} />
        ) : (
          <p className="text-xl">Nessun prodotto in questo ordine</p>
        )}
      </div>
    </DialogWrapper>
  );
}
