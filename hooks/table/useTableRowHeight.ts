import { useLayoutEffect, useRef, useState } from "react";

export default function useStableTableHeight(
  tableRef: React.RefObject<HTMLDivElement | null>,
  maxRows: number
) {
  const [fixedHeight, setFixedHeight] = useState<number | null>(null);
  const [colSig, setColSig] = useState<string>(""); // track visible columns signature
  const cleanup = useRef<() => void>(() => {});

  useLayoutEffect(() => {
    const el = tableRef.current;
    if (!el) return;

    const measureOnce = () => {
      const ths = Array.from(el.querySelectorAll("thead th"));
      const sig = ths.map((th) => th.textContent?.trim() || "").join("|");

      // If column structure changed, update signature to trigger re-measure
      if (sig !== colSig) {
        setColSig(sig);
      }

      const header = el.querySelector<HTMLElement>("thead");
      const rowEls = el.querySelectorAll<HTMLTableRowElement>("tbody tr");
      if (!header || rowEls.length === 0) return;

      // 🧩 NEW: detect single empty row (data-empty="true")
      if (rowEls.length === 1 && rowEls[0].dataset.empty === "true") {
        // Do not re-measure, keep previous height stable
        return;
      }

      const headerH = header.getBoundingClientRect().height;
      const firstRow = rowEls[0];
      let rowH = firstRow.getBoundingClientRect().height;

      // Handle single-row visual border quirks
      if (rowEls.length === 1) rowH += 1;

      const cs = getComputedStyle(el);
      const chrome =
        parseFloat(cs.borderTopWidth || "0") +
        parseFloat(cs.borderBottomWidth || "0") +
        parseFloat(cs.paddingTop || "0") +
        parseFloat(cs.paddingBottom || "0");

      const total = Math.ceil(headerH + maxRows * rowH + chrome);
      setFixedHeight(total);
    };

    const schedule = () => {
      const inDialog = el.closest('[role="dialog"], [data-radix-dialog-content]') != null;
      if (inDialog) {
        setTimeout(() => requestAnimationFrame(measureOnce), 250);
      } else {
        requestAnimationFrame(measureOnce);
      }
    };

    const mo = new MutationObserver(() => schedule());
    mo.observe(el, { childList: true, subtree: true });

    const ro = new ResizeObserver(() => schedule());
    ro.observe(el);

    schedule();

    cleanup.current = () => {
      mo.disconnect();
      ro.disconnect();
    };

    return () => cleanup.current();
  }, [tableRef, maxRows, colSig]);

  return {
    height: fixedHeight ?? undefined,
    ready: fixedHeight != null,
  };
}
