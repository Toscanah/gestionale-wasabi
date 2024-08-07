import { ColumnDef } from "@tanstack/react-table";
import TableColumn from "../components/TableColumn";
import { ProductWithInfo } from "../types/ProductWithInfo";
import EditProduct from "./actions/EditProduct";
import DeleteProduct from "./actions/DeleteProduct";
import { DotsThree } from "@phosphor-icons/react";
import EditOptions from "./actions/EditOptions";

export default function getColumns(
  onEdit: (editedProduct: ProductWithInfo) => void,
  onDelete: (deletedProduct: ProductWithInfo) => void
): ColumnDef<ProductWithInfo>[] {
  return [
    TableColumn({
      accessorKey: "code",
      header: "Codice",
    }),

    TableColumn({
      accessorKey: "name",
      header: "Nome",
    }),

    TableColumn({
      accessorKey: "desc",
      header: "Descrizione",
    }),

    TableColumn({
      accessorKey: "home_price",
      header: "Asporto",
      cellContent: (row) => {
        return "€ " + row.original.home_price;
      },
    }),

    TableColumn({
      accessorKey: "site_price",
      header: "In loco",
      cellContent: (row) => {
        return "€ " + row.original.site_price;
      },
    }),

    TableColumn({
      accessorKey: "category.category",
      header: "Categoria",
    }),

    TableColumn({
      accessorKey: "rice",
      header: "Riso",
    }),

    // TableColumn({
    //   accessorKey: "category.options",
    //   header: "Opzioni",
    //   cellContent: (row) => <EditOptions product={row.original} />,
    // }),

    TableColumn({
      accessorKey: "actions",
      header: "Azioni",
      cellContent: (row) => (
        <div className="flex space-x-2">
          <EditProduct product={row.original} onEdit={onEdit} />
          <DeleteProduct product={row.original} onDelete={onDelete} />
        </div>
      ),
    }),
  ];
}
