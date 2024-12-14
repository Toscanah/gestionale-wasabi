import { ColumnDef } from "@tanstack/react-table";
import TableColumn from "../../components/table/TableColumn";
import { CategoryWithOptions } from "../../models";

const columns: ColumnDef<CategoryWithOptions>[] = [
  TableColumn({
    accessorKey: "category",
    header: "Categoria",
  }),

  TableColumn<CategoryWithOptions>({
    accessorKey: "options",
    header: "Opzioni",
    cellContent: (row) =>
      row.original.options
        .map(
          (option) =>
            option.option.option_name.charAt(0).toUpperCase() + option.option.option_name.slice(1)
        )
        .join(", "),
  }),
];

export default columns;