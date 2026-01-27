import { ColumnDef } from "@tanstack/react-table";
import { OptionWithCategories } from "@/lib/shared";
import { FieldColumn, JoinColumn } from "@/components/table/TableColumns";

const columns: ColumnDef<OptionWithCategories>[] = [
  FieldColumn({
    key: "option_name",
    header: "Opzione",
  }),

  JoinColumn({ options: { key: "categories" }, header: "Usata in" }),
];

export default columns;
