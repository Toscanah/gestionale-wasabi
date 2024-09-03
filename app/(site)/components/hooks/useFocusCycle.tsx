import { KeyboardEvent, RefObject, useRef } from "react";

export function useFocusCycle(refs: RefObject<HTMLElement>[]) {
  const currentRefIndex = useRef(0);

  const updateCurrentRefIndex = () => {
    const focusedElement = document.activeElement;
    const index = refs.findIndex((ref) => ref.current === focusedElement);
    if (index !== -1) {
      currentRefIndex.current = index;
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();

      updateCurrentRefIndex();

      const nextIndex = (currentRefIndex.current + 1) % refs.length;
      currentRefIndex.current = nextIndex;
      refs[nextIndex].current?.focus();
    }
  };

  return {
    handleKeyDown,
  };
}
