import { ColumnDef } from "@tanstack/react-table";
import { CategoryWithOptions } from "@/lib/shared";
import { FieldColumn, JoinColumn } from "@/components/table/TableColumns";

const columns: ColumnDef<CategoryWithOptions>[] = [
  FieldColumn({
    key: "category",
    header: "Categoria",
  }),

  JoinColumn({ options: { key: "options" } }),
];

export default columns;
