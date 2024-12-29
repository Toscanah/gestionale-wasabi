import { ColumnDef } from "@tanstack/react-table";
import TableColumn from "../../components/table/TableColumn";
import { OptionWithCategories } from "@/app/(site)/models";
import joinItemsWithComma from "../../functions/formatting-parsing/joinItemsWithComma";

const columns: ColumnDef<OptionWithCategories>[] = [
  TableColumn({
    accessorKey: "option_name",
    header: "Opzione",
  }),

  TableColumn({
    accessorKey: "categories",
    header: "Usata in",
    cellContent: (row) => joinItemsWithComma(row.original, "categories"),
  }),
];

export default columns;
