// src/types/react-table.d.ts
import "@tanstack/react-table";

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    /** Whether the table is in loading/skeleton mode */
    isLoading?: boolean;

    /** Generic theme key */
    theme?: string;
  }
}
