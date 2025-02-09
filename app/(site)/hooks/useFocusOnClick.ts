import { useEffect } from "react";

export default function useFocusOnClick(ids: string[]) {
  useEffect(() => {
    const handleFocus = (event: FocusEvent) => {
      const target = event.target as HTMLInputElement | HTMLTextAreaElement;
      if (target) {
        target.select();
      }
    };

    const elements = ids.map((id) => document.getElementById(id)).filter(Boolean);
    elements.forEach((element) => element?.addEventListener("focus", handleFocus));

    return () => {
      elements.forEach((element) => element?.removeEventListener("focus", handleFocus));
    };
  }, [ids]);
}
