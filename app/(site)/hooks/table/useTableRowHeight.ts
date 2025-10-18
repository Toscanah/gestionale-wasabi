import { useLayoutEffect, useRef, useState } from "react";

export default function useStableTableHeight(
  tableRef: React.RefObject<HTMLDivElement | null>,
  maxRows: number
) {
  const [fixedHeight, setFixedHeight] = useState<number | null>(null);

  const measured = useRef(false);
  const cleanup = useRef<() => void>(() => {});

  useLayoutEffect(() => {
    const el = tableRef.current;
    if (!el) return;

    const measureOnce = () => {
      if (measured.current) return;

      const header = el.querySelector<HTMLElement>("thead");
      const rowEls = el.querySelectorAll<HTMLTableRowElement>("tbody tr");
      if (!header || rowEls.length === 0) return;

      const headerH = header.getBoundingClientRect().height;
      const firstRow = rowEls[0];
      let rowH = firstRow.getBoundingClientRect().height;

      // If there's exactly 1 real row, it's probably borderless (last-row styling).
      if (rowEls.length === 1) rowH += 1;

      // Container chrome (borders + padding)
      const cs = getComputedStyle(el);
      const vBorder =
        parseFloat(cs.borderTopWidth || "0") + parseFloat(cs.borderBottomWidth || "0");
      const vPadding = parseFloat(cs.paddingTop || "0") + parseFloat(cs.paddingBottom || "0");
      const chrome = vBorder + vPadding;

      const total = Math.ceil(headerH + maxRows * rowH + chrome);

      setFixedHeight(total);
      measured.current = true;

      cleanup.current();
    };

    // If inside a dialog, wait a bit longer before measuring to avoid transform scaling issues
    const inDialog = el.closest('[role="dialog"], [data-radix-dialog-content]') != null;
    const schedule = () => {
      if (inDialog) {
        setTimeout(() => requestAnimationFrame(measureOnce), 250);
      } else {
        requestAnimationFrame(measureOnce);
      }
    };

    const mo = new MutationObserver(schedule);
    mo.observe(el, { childList: true, subtree: true });

    const ro = new ResizeObserver(schedule);
    ro.observe(el);

    schedule();

    cleanup.current = () => {
      mo.disconnect();
      ro.disconnect();
    };

    return () => cleanup.current();
  }, [tableRef, maxRows]);

  return {
    height: fixedHeight ?? undefined,
    ready: fixedHeight != null,
  };
}
