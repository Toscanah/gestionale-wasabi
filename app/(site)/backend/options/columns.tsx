import { ColumnDef } from "@tanstack/react-table";
import TableColumn from "../../components/table/TableColumn";
import { OptionWithCategories } from "@/app/(site)/models";

const columns: ColumnDef<OptionWithCategories>[] = [
  TableColumn({
    accessorKey: "option_name",
    header: "Opzione",
  }),

  TableColumn({
    accessorKey: "categories",
    header: "Usata in",
    cellContent: (row) => row.original.categories
    .map(
      (cat) =>
        cat.category.category.charAt(0).toUpperCase() + cat.category.category.slice(1)
    )
    .join(", "),
  }),
];

export default columns;
