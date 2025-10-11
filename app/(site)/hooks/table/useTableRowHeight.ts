import { useEffect, useState } from "react";

export default function useTableRowHeight(tableRef: React.RefObject<HTMLTableElement | null>) {
  const [rowHeight, setRowHeight] = useState<number>(0);
  const [headerHeight, setHeaderHeight] = useState<number>(0);

  useEffect(() => {
    const el = tableRef.current;
    if (!el) return;

    console.log("checking", el)

    const firstRow = el.querySelector("tbody tr");
    const header = el.querySelector("thead");
    if (firstRow) setRowHeight(firstRow.getBoundingClientRect().height);
    if (header) setHeaderHeight(header.getBoundingClientRect().height);

  }, [tableRef]);

  const getTotalHeight = (numRows: number) =>
    rowHeight > 0 ? rowHeight * numRows + headerHeight : undefined;

  return { rowHeight, headerHeight, getTotalHeight };
}
