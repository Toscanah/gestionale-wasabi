import { KeyboardEvent, useRef } from "react";

export default function useFocusCycle() {
  const refs = useRef<HTMLElement[]>([]);
  const currentRefIndex = useRef(0);

  const addRefs = (...newRefs: (HTMLElement | null)[]) => {
    newRefs.forEach((ref) => {
      if (ref && !refs.current.includes(ref)) {
        refs.current.push(ref);
      }
    });
  };

  const updateCurrentRefIndex = () => {
    const focusedElement = document.activeElement;
    const index = refs.current.findIndex((ref) => ref === focusedElement);
    if (index !== -1) {
      currentRefIndex.current = index;
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();
      updateCurrentRefIndex();

      const nextIndex = (currentRefIndex.current + 1) % refs.current.length;
      currentRefIndex.current = nextIndex;
      refs.current[nextIndex]?.focus();
    }
  };

  return {
    addRefs,
    handleKeyDown,
  };
}
