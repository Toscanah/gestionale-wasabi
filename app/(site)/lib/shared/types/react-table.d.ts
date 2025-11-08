// src/types/react-table.d.ts
import "@tanstack/react-table";

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    isLoading?: boolean;
    theme?: string;
    paginationMode?: "client" | "server";
  }
}

declare module "@tanstack/table-core" {
  interface ColumnMeta<TData extends RowData, TValue> {
    style?: {
      textAlign: "left" | "center" | "right";
    };
    label?: string;
    exportValue?: (row: TData) => Primitive;
  }
}
