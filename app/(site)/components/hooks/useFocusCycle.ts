import { KeyboardEvent, useRef } from "react";

export default function useFocusCycle() {
  const refs = useRef<Set<HTMLElement>>(new Set());
  const currentRefIndex = useRef(0);

  const addRefs = (...newRefs: (HTMLElement | null)[]) =>
    newRefs.forEach((ref) => {
      if (ref) {
        refs.current.add(ref);
      }
    });

  const getIndexOfFocusedElement = () =>
    Array.from(refs.current).findIndex((el) => el === document.activeElement);

  const moveFocus = (delta: number) => {
    const elements = Array.from(refs.current);
    const totalElements = elements.length;

    if (totalElements === 0) return;

    currentRefIndex.current = (currentRefIndex.current + delta + totalElements) % totalElements;
    elements[currentRefIndex.current]?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    const focusMovementKeys = ["Enter", "Tab", "ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft"];

    if (focusMovementKeys.includes(e.key)) {
      e.preventDefault();
      currentRefIndex.current = getIndexOfFocusedElement();

      if (e.key === "Enter" || e.key === "Tab" || e.key === "ArrowDown" || e.key === "ArrowRight") {
        moveFocus(1);
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        moveFocus(-1);
      }
    }
  };

  return {
    addRefs,
    handleKeyDown,
  };
}
