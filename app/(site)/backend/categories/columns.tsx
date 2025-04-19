import { ColumnDef } from "@tanstack/react-table";
import TableColumn from "../../components/table/TableColumn";
import { CategoryWithOptions } from "@shared"
;

const columns: ColumnDef<CategoryWithOptions>[] = [
  TableColumn({
    accessorKey: "category",
    header: "Categoria",
  }),

  TableColumn({ joinOptions: { key: "options" } }),
];

export default columns;
