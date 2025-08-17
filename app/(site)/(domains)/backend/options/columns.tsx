import { ColumnDef } from "@tanstack/react-table";
import { OptionWithCategories } from "@/app/(site)/lib/shared";
import { FieldColumn, JoinColumn } from "@/app/(site)/components/table/TableColumns";

const columns: ColumnDef<OptionWithCategories>[] = [
  FieldColumn({
    key: "option_name",
    header: "Opzione",
  }),

  JoinColumn({ options: { key: "categories" }, header: "Usata in" }),
];

export default columns;
