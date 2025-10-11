import { useEffect, useState } from "react";

export default function useTableRowHeight(tableRef: React.RefObject<HTMLDivElement | null>) {
  const [rowHeight, setRowHeight] = useState<number>(0);
  const [headerHeight, setHeaderHeight] = useState<number>(0);

  useEffect(() => {
    const el = tableRef.current;
    if (!el) return;

    const firstRow = el.querySelector("tbody tr");
    const header = el.querySelector("thead");
    if (firstRow) setRowHeight(firstRow.getBoundingClientRect().height);
    if (header) setHeaderHeight(header.getBoundingClientRect().height);
  }, [tableRef]);

  const getTotalHeight = (numRows: number) => {
    const el = tableRef.current;
    if (!el || numRows <= 0) return undefined;

    const header = el.querySelector("thead");
    const rows = el.querySelectorAll<HTMLTableRowElement>("tbody tr");
    const k = Math.min(numRows, rows.length);

    if (!header || k === 0) return undefined;

    const headerTop = header.getBoundingClientRect().top;
    const lastBottom = rows[k - 1].getBoundingClientRect().bottom;

    const totalHeight = lastBottom - headerTop;

    return Math.round(totalHeight) + 1.5;
  };

  return { rowHeight, headerHeight, getTotalHeight };
}
