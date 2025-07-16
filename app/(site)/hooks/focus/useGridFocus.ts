import { KeyboardEvent, useCallback, useEffect, useRef, useState } from "react";

export interface FocussableInput {
  rowIndex: number;
  colIndex: number;
}

export default function useGridFocus(defaultFocusedInput: FocussableInput, maxCols: number) {
  const inputRefs = useRef<Map<string, HTMLInputElement | null>>(new Map()).current;
  const [focusedInput, setFocusedInput] = useState<FocussableInput>(defaultFocusedInput);

  useEffect(() => moveToInput(focusedInput), [focusedInput]);

  const moveToInput = (inputToFocus: FocussableInput) => {
    const inputToMove = getInputRef(inputToFocus);

    if (inputToMove) {
      setTimeout(() => {
        inputToMove.focus();
        inputToMove.select();
      }, 0);
    }
  };

  const addInputRef = (ref: HTMLInputElement | null, newInput: FocussableInput) => {
    const refKey = `${newInput.rowIndex}-${newInput.colIndex}`;

    if (ref) {
      inputRefs.set(refKey, ref);
    }
  };

  const getNextInputToFocus = useCallback(
    (e: KeyboardEvent<HTMLInputElement>, currentInput: FocussableInput) => {
      const { rowIndex, colIndex } = currentInput;

      const keyMap = new Map<string, () => FocussableInput | null>([
        [
          "Enter",
          () =>
            colIndex < maxCols
              ? { rowIndex, colIndex: colIndex + 1 }
              : { rowIndex: rowIndex + 1, colIndex: 0 },
        ],
        [
          "ArrowRight",
          () =>
            colIndex < maxCols
              ? { rowIndex, colIndex: colIndex + 1 }
              : { rowIndex: rowIndex + 1, colIndex: 0 },
        ],
        ["ArrowDown", () => ({ rowIndex: rowIndex + 1, colIndex })],
        ["ArrowUp", () => (rowIndex > 0 ? { rowIndex: rowIndex - 1, colIndex } : null)],
        [
          "ArrowLeft",
          () =>
            colIndex === 0
              ? rowIndex > 0
                ? { rowIndex: rowIndex - 1, colIndex: maxCols }
                : null
              : { rowIndex, colIndex: colIndex - 1 },
        ],
      ]);

      return keyMap.get(e.key)?.() || null;
    },
    []
  );

  const handleKeyNavigation = (
    e: KeyboardEvent<HTMLInputElement>,
    currentInput: FocussableInput
  ) => {
    const nextInput = getNextInputToFocus(e, currentInput);

    if (nextInput) {
      setFocusedInput(nextInput);
    }
  };

  const getInputRef = (input: FocussableInput) =>
    inputRefs.get(`${input.rowIndex}-${input.colIndex}`);

  return {
    focusedInput,
    getInputRef,
    setFocusedInput,
    addInputRef,
    handleKeyNavigation,
  };
}
