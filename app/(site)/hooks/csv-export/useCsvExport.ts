import z from "zod";
import { csvFilterRows, formatCsvFilters } from "../../lib/services/csv-export/formatCsvFilters";
import {
  APIFilters,
  APIFiltersSchema,
  BaseAPIFilters,
  FlattenedAPIFilters,
} from "../../lib/shared/schemas/common/filters/filters";
import { ColumnMeta, Table } from "@tanstack/react-table";

export type FiltersMeta = {
  categories?: Record<number, string>;
};

function downloadBlob(content: string, filename: string, mimeType = "text/csv;charset=utf-8") {
  const blob = new Blob(["\uFEFF" + content], { type: mimeType });
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  // Clean up the object URL
  window.URL.revokeObjectURL(url);
}

export default function useCsvExport<T>(table: Table<T>) {
  function exportCsv({
    filename = "export.csv",
    filters,
    filtersMeta,
  }: {
    filename?: string;
    filters?: Partial<FlattenedAPIFilters>;
    filtersMeta?: FiltersMeta;
  }) {
    if (!table) return;

    const rows = table.getFilteredRowModel().rows;

    const exportableCols = table
      .getAllColumns()
      .filter(
        (col) =>
          col.getIsVisible() &&
          !["select_", "action_col_"].some((prefix) => col.id.startsWith(prefix)) &&
          !["#", "index"].includes(col.id) &&
          !["select", "action", "hybrid", "index"].some((kw) => col.id.toLowerCase().includes(kw))
      );

    if (exportableCols.length === 0) {
      console.warn("No exportable columns found.");
      return;
    }

    // 🧠 format filters for the CSV header
    const filterLines = csvFilterRows(formatCsvFilters(filters, filtersMeta));

    const headers = exportableCols.map((col) => {
      const label =
        (col.columnDef.meta as any)?.label ??
        (typeof col.columnDef.header === "string" ? col.columnDef.header : col.id);
      return `"${label}"`;
    });

    const dataRows = rows.map((row) =>
      exportableCols
        .map((col) => {
          const meta = col.columnDef.meta;
          let rawValue: unknown;

          if (meta?.exportValue) {
            rawValue = meta.exportValue(row.original);
          } else {
            rawValue = row.getValue(col.id);
          }

          return escapeCsvValue(rawValue);
        })
        .join(",")
    );

    const csv = [...filterLines, headers.join(","), ...dataRows].join("\n");
    downloadBlob(csv, filename);
  }

  return { exportCsv };
}

function escapeCsvValue(value: unknown): string {
  if (value == null) return "";
  const str = String(value);
  if (/[",\n]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
  return str;
}
