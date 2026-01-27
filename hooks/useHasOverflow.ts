import { useEffect, useState } from "react";

export default function useHasOverflow(ref: React.RefObject<HTMLDivElement | null> | null) {
  const [hasOverflow, setHasOverflow] = useState({
    vertical: false,
    horizontal: false,
  });

  useEffect(() => {
    const el = ref?.current;
    if (!el) return;

    const checkOverflow = () => {
      setHasOverflow({
        vertical: el.scrollHeight > el.clientHeight,
        horizontal: el.scrollWidth > el.clientWidth,
      });
    };

    checkOverflow();

    const resizeObserver = new ResizeObserver(checkOverflow);
    resizeObserver.observe(el);

    const mutationObserver = new MutationObserver(checkOverflow);
    mutationObserver.observe(el, { childList: true, subtree: true });

    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [ref]);

  return hasOverflow;
}
