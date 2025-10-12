import { useEffect, useState } from "react";

export default function useTableRowHeight(tableRef: React.RefObject<HTMLDivElement | null>) {
  const [rowHeight, setRowHeight] = useState<number>(0);
  const [headerHeight, setHeaderHeight] = useState<number>(0);
  const [maxHeight, setMaxHeight] = useState<number>(0);

  const measureHeights = () => {
    const el = tableRef.current;
    if (!el) return;

    const firstRow = el.querySelector("tbody tr");
    const header = el.querySelector("thead");
    if (firstRow) setRowHeight(firstRow.getBoundingClientRect().height);
    if (header) setHeaderHeight(header.getBoundingClientRect().height);

    // Compute full height currently visible
    const rows = el.querySelectorAll<HTMLTableRowElement>("tbody tr");
    if (header && rows.length > 0) {
      const headerTop = header.getBoundingClientRect().top;
      const lastBottom = rows[rows.length - 1].getBoundingClientRect().bottom;
      const totalHeight = Math.round(lastBottom - headerTop + 1.5);
      setMaxHeight((prev) => Math.max(prev, totalHeight)); // ✅ only runs inside effect
    }
  };

  useEffect(() => {
    const el = tableRef.current;
    if (!el) return;

    measureHeights();

    const observer = new MutationObserver(() => measureHeights());
    observer.observe(el, { childList: true, subtree: true });

    return () => observer.disconnect();
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

    return Math.round(lastBottom - headerTop + 1.5);
  };

  /** Return the stable remembered height */
  const getStableHeight = (numRows: number) => {
    const computed = getTotalHeight(numRows);
    return Math.max(maxHeight, computed ?? 0);
  };

  return { rowHeight, headerHeight, getTotalHeight, getStableHeight, maxHeight };
}
