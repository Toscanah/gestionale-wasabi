import { ColumnDef } from "@tanstack/react-table";
import TableColumn from "../components/TableColumn";
import { ProductWithInfo } from "../types/ProductWithInfo";
import EditProduct from "./actions/EditProduct";
import DeleteProduct from "./actions/DeleteProduct";

export default function getColumns(
  onEdit: (editedProduct: ProductWithInfo) => void,
  onDelete: (deletedProduct: ProductWithInfo) => void,
): ColumnDef<ProductWithInfo>[] {
  return [
    TableColumn({
      accessorKey: "code",
      headerLabel: "Codice",
    }),

    TableColumn({
      accessorKey: "name",
      headerLabel: "Nome",
    }),

    TableColumn({
      accessorKey: "desc",
      headerLabel: "Descrizione",
    }),

    TableColumn({
      accessorKey: "home_price",
      headerLabel: "Asporto",
      cellContent: (row) => {
        return "€ " + row.original.home_price;
      },
    }),

    TableColumn({
      accessorKey: "site_price",
      headerLabel: "In loco",
      cellContent: (row) => {
        return "€ " + row.original.site_price;
      },
    }),

    TableColumn({
      accessorKey: "category.category",
      headerLabel: "Categoria",
    }),

    TableColumn({
      accessorKey: "rice",
      headerLabel: "Riso",
    }),

    TableColumn({
      accessorKey: "actions",
      headerLabel: "Azioni",
      cellContent: (row) => (
        <div className="flex space-x-2">
          <EditProduct product={row.original} onEdit={onEdit} />
          <DeleteProduct product={row.original} onDelete={onDelete}/>
        </div>
      ),
    }),
  ];
}
