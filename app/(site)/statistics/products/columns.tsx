import { ColumnDef } from "@tanstack/react-table";
import { Product } from "../../models";
import TableColumn from "../../components/table/TableColumn";
import { ProductWithStats } from "../../types/ProductWithStats";

const columns: ColumnDef<ProductWithStats>[] = [
  TableColumn({
    accessorKey: "code",
    header: "Codice",
  }),

  TableColumn({ 
    accessorKey: "desc",
    header: "Descrizione",
  }),

  TableColumn({
    accessorKey: "quantity",
    header: "Quantitativo",
  }),

  TableColumn({
    accessorKey: "total",
    header: "Totale",
  })

]

export default columns;