import { ProductInOrder } from "@/lib/shared";
import WasabiDialog from "../../shared/wasabi/WasabiDialog";
import { Button } from "@/components/ui/button";
import useTable from "@/hooks/table/useTable";
import productColumns from "../common/productColumns";
import Table from "../../table/Table";
import SearchBar from "../../shared/filters/common/SearchBar";
import useQueryFilter from "@/hooks/table/useQueryFilter";
import ResetTableControlsBtn from "../../shared/filters/common/ResetTableControlsBtn";
import { trpc } from "@/lib/trpc/client";
import { useEffect, useState } from "react";
import useSkeletonTable from "@/hooks/table/useSkeletonTable";
import CategoryFilter from "../../shared/filters/select/CategoryFilter";

interface AllProductsDialogProps {
  allProducts: ProductInOrder[];
  owner: string;
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

export default function AllProductsDialog({ allProducts, owner }: AllProductsDialogProps) {
  const [filteredProducts, setFilteredProducts] = useState<ProductInOrder[]>(allProducts);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [open, setOpen] = useState(false);
  const { debouncedQuery, inputQuery, setInputQuery } = useQueryFilter();

  const groupedProducts = groupProducts(filteredProducts).sort((a, b) => b.quantity - a.quantity);
  const categoriesMutation = trpc.categories.getAll.useQuery(undefined, { enabled: open });

  const { tableColumns, tableData } = useSkeletonTable({
    columns: productColumns(false),
    data: groupedProducts,
    isLoading: categoriesMutation.isLoading,
  });

  useEffect(() => {
    if (selectedCategories.length > 0) {
      setFilteredProducts(
        allProducts.filter(
          (p) =>
            typeof p.product.category_id === "number" &&
            selectedCategories.includes(p.product.category_id)
        )
      );
    } else {
      setFilteredProducts(allProducts);
    }
  }, [selectedCategories]);

  const table = useTable({
    data: tableData,
    columns: tableColumns,
    query: debouncedQuery,
    setQuery: setInputQuery,
    pagination: { mode: "client", pageSize: tableData.length,  },
  });

  return (
    <WasabiDialog
      onOpenChange={(open) => {
        setInputQuery("");
        setOpen(open);
      }}
      open={open}
      title={"Tutti i prodotti ordinati di " + owner}
      putSeparator
      size="mediumPlus"
      putUpperBorder
      trigger={<Button className="w-full">Mostra tutti i prodotti</Button>}
    >
      <div className="max-h-[70vh] overflow-y-auto flex flex-col gap-4">
        <div className="w-full flex items-center gap-4">
          <SearchBar query={inputQuery} onChange={setInputQuery} />
          {/* <CategoryFilter
            allCategories={categoriesMutation.data ?? []}
            selectedCategoryIds={selectedCategories}
            onCategoryIdsChange={setSelectedCategories}
          /> */}
          <ResetTableControlsBtn
            onReset={() => setInputQuery("")}
            hasFilters={!!inputQuery || selectedCategories.length > 0}
            table={table}
          />
        </div>
        <Table table={table}  maxRows={10}/>
      </div>
    </WasabiDialog>
  );
}
