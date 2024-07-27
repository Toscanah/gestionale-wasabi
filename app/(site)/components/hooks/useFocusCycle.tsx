import { KeyboardEvent, RefObject, useRef } from "react";

export function useFocusCycle(refs: RefObject<any>[]) {
  const currentRefIndex = useRef(0);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {

      e.preventDefault();
      const nextIndex = (currentRefIndex.current + 1) % refs.length;
      currentRefIndex.current = nextIndex;
      refs[nextIndex].current?.focus();
    }
  };

  return {
    handleKeyDown,
  };
}
