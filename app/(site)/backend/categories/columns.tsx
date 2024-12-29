import { ColumnDef } from "@tanstack/react-table";
import TableColumn from "../../components/table/TableColumn";
import { CategoryWithOptions } from "../../models";
import joinItemsWithComma from "../../functions/formatting-parsing/joinItemsWithComma";

const columns: ColumnDef<CategoryWithOptions>[] = [
  TableColumn({
    accessorKey: "category",
    header: "Categoria",
  }),

  TableColumn<CategoryWithOptions>({
    accessorKey: "options",
    header: "Opzioni",
    cellContent: (row) => joinItemsWithComma(row.original, "options"),
  }),
];

export default columns;
