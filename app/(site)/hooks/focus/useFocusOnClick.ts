import { useEffect } from "react";

export default function useFocusOnClick(ids: string[]) {
  useEffect(() => {
    const handleFocus = (event: Event) => {
      const target = event.target as HTMLInputElement | HTMLTextAreaElement;
      target?.select();
    };

    const handleMouseDown = (event: Event) => {
      const mouseEvent = event as MouseEvent;
      const target = mouseEvent.target as HTMLInputElement | HTMLTextAreaElement;
      // Only select if the element is already focused
      if (target && document.activeElement === target) {
        // Delay to let default click behavior finish (e.g. placing cursor)
        setTimeout(() => target.select(), 0);
      }
    };

    const elements = ids.map((id) => document.getElementById(id)).filter(Boolean) as (
      | HTMLInputElement
      | HTMLTextAreaElement
    )[];

    elements.forEach((element) => {
      element.addEventListener("focus", handleFocus);
      element.addEventListener("mousedown", handleMouseDown);
    });

    return () => {
      elements.forEach((element) => {
        element.removeEventListener("focus", handleFocus);
        element.removeEventListener("mousedown", handleMouseDown);
      });
    };
  }, [ids]);
}
