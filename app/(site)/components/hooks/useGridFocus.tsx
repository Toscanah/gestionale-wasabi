import { KeyboardEvent, useEffect, useRef, useState } from "react";

export interface FocussableInput {
  rowIndex: number;
  colIndex: number;
}

export default function useGridFocus(defaultFocusedInput: FocussableInput, maxCols: number) {
  const inputRefs = useRef<Map<string, HTMLInputElement | null>>(new Map()).current;
  const [focusedInput, setFocusedInput] = useState<FocussableInput>(defaultFocusedInput);

  useEffect(() => {
    moveToInput(focusedInput);
  }, [focusedInput]);

  const moveToInput = (inputToFocus: FocussableInput) => {
    const refKey = `${inputToFocus.rowIndex}-${inputToFocus.colIndex}`;
    const inputToMove = inputRefs.get(refKey);

    if (inputToMove) {
      inputToMove.focus();
      inputToMove.select();
    }
  };

  const addInputRef = (ref: HTMLInputElement | null, newInput: FocussableInput) => {
    const refKey = `${newInput.rowIndex}-${newInput.colIndex}`;
    if (ref) {
      inputRefs.set(refKey, ref);
    }
  };

  const getNextInputToFocus = (
    e: KeyboardEvent<HTMLInputElement>,
    currentInput: FocussableInput
  ) => {
    const { rowIndex, colIndex } = currentInput;

    switch (e.key) {
      case "Enter":
      case "ArrowRight":
        if (colIndex < maxCols) {
          return { rowIndex, colIndex: colIndex + 1 };
        } else {
          return { rowIndex: rowIndex + 1, colIndex: 0 };
        }
      case "ArrowDown":
        return { rowIndex: rowIndex + 1, colIndex };
      case "ArrowUp":
        if (rowIndex > 0) {
          return { rowIndex: rowIndex - 1, colIndex };
        }
        break;
      case "ArrowLeft":
        if (colIndex == 0) {
          return { rowIndex: rowIndex - 1, colIndex: colIndex + 1 };
        } else {
          return { rowIndex, colIndex: colIndex - 1 };
        }
      default:
        return null;
    }
    return null;
  };

  const handleKeyNavigation = (
    e: KeyboardEvent<HTMLInputElement>,
    currentInput: FocussableInput
  ) => {
    const nextInput = getNextInputToFocus(e, currentInput);

    if (nextInput) {
      moveToInput(nextInput);
      setFocusedInput(nextInput);
    }
  };

  const getInputRef = (input: FocussableInput) => {
    const refKey = `${input.rowIndex}-${input.colIndex}`;
    return inputRefs.get(refKey);
  };

  return {
    focusedInput,
    getInputRef,
    setFocusedInput,
    addInputRef,
    handleKeyNavigation,
  };
}
