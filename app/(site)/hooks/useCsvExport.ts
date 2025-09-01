import { useCallback } from "react";

export default function useCsvExport<T>(
  data: T[],
  headers: Record<keyof T, string>,
  filters: Record<string, string | number | null | undefined> = {}
) {
  const downloadCsv = useCallback(
    (fileName: string = "export.csv") => {
      if (!data || data.length === 0) return;

      // ---- 1. Filters row (1 filter = 1 cell)
      const filterLine =
        Object.entries(filters).length > 0
          ? Object.entries(filters)
              .map(([k, v]) => `${k}: ${v ?? ""}`)
              .join(",")
          : "";

      // ---- 2. Header row
      const headerLine = Object.values(headers).join(",");

      // ---- 3. Data rows
      const rows = data
        .map((row) =>
          Object.keys(headers)
            .map((key) => {
              const val = row[key as keyof T];
              return typeof val === "number"
                ? val.toString().replace(".", ",") // decimal separator
                : `"${val ?? ""}"`; // quotes to be safe
            })
            .join(",")
        )
        .join("\n");

      // ---- 4. Final CSV
      const csv = [filterLine, "", headerLine, rows].join("\n");

      // ---- 5. Trigger download
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    [data, headers, filters]
  );

  return { downloadCsv };
}
