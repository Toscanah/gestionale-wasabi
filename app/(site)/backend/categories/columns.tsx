import { ColumnDef } from "@tanstack/react-table";
import TableColumn from "../../components/table/TableColumn";

import { CategoryWithOptions } from "../../types/CategoryWithOptions";
import { KitchenType } from "@prisma/client";

const columns: ColumnDef<CategoryWithOptions>[] = [
  TableColumn({
    accessorKey: "category",
    header: "Categoria",
  }),

  TableColumn({
    accessorKey: "kitchen",
    header: "Tipo di cucina",
    cellContent: (row) => (row.original.kitchen == KitchenType.COLD ? "Fredda" : "Calda"),
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
