import { ColumnDef } from "@tanstack/react-table";
import { Product } from "../../models";
import TableColumn from "../../components/table/TableColumn";

const columns: ColumnDef<Product>[] = [
  TableColumn({
    accessorKey: "code",
    header: "Codice",
  }),

  TableColumn({ 
    accessorKey: "desc",
    header: "Descrizione",
  })

]

export default columns;