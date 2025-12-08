import { HybridColumn } from "@/app/(site)/components/table/TableColumns";
import { CommonColumnProps } from "./orderColumns";
import { ProductInOrder } from "@/app/(site)/lib/shared";
import { OrderTableMeta } from "../OrderTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FocussableInput } from "@/app/(site)/hooks/focus/useGridFocus";
import { isArrows, isSubmit } from "@/app/(site)/lib/utils/global/keyboard";
import { useCallback, useEffect } from "react";
import { debounce } from "lodash";

interface QuantityColumnProps extends CommonColumnProps {
  focusedInput: FocussableInput;
  getInputRef: (input: FocussableInput) => HTMLInputElement | null | undefined;
}

enum QuantityChangeDir {
  UP = "up",
  DOWN = "down",
}

const QuantityArrow = ({
  disabled,
  onClick,
  label,
}: {
  disabled: boolean;
  onClick: () => void;
  label: string;
}) => {
  return (
    <Button disabled={disabled} className="p-0 h-9 w-9" variant="outline" onClick={onClick}>
      {label}
    </Button>
  );
};

export default function QuantityColumn({
  addInputRef,
  setFocusedInput,
  handleKeyNavigation,
  rows,
  setRowValue,
  focusedInput,
  getInputRef,
}: QuantityColumnProps) {
  const debouncedFinalize = useCallback(
    debounce(
      (
        rowIndex: number,
        quantity: number,
        finalizeRowUpdate: (rowIndex: number, quantity?: number) => void
      ) => {
        finalizeRowUpdate(rowIndex, quantity);
      },
      300
    ),
    []
  );

  const handleQuantityArrows = useCallback(
    (
      direction: QuantityChangeDir,
      rowIndex: number,
      finalizeRowUpdate: (rowIndex: number, quantity?: number) => void
    ) => {
      const inputRef = getInputRef({ rowIndex, colIndex: 1 });
      const currentValue = inputRef?.value ? Number(inputRef.value) : 0;
      const updated = Math.max(
        0,
        direction === QuantityChangeDir.UP ? currentValue + 1 : currentValue - 1
      );

      // Immediate visual update
      setRowValue(rowIndex, "quantity", updated);

      // Debounced finalization
      debouncedFinalize(rowIndex, updated, finalizeRowUpdate);
    },
    [getInputRef, setRowValue, debouncedFinalize]
  );

  const handleOnKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    rowIndex: number,
    finalizeRowUpdate: (rowIndex: number, quantity?: number) => void
  ) => {
    if (isArrows(e)) {
      return handleKeyNavigation(e, { rowIndex, colIndex: 1 });
    }

    if (isSubmit(e)) {
      e.preventDefault();
      const newQty = Number(e.currentTarget.value || 0);
      finalizeRowUpdate(rowIndex, newQty);
    }
  };

  const handleOnClick = (rowIndex: number) => {
    setFocusedInput({ rowIndex, colIndex: 1 });
  };

  useEffect(() => {
    // Only trigger when focus is on the quantity column
    if (focusedInput.colIndex !== 1) return;

    const rowIndex = focusedInput.rowIndex;

    // Get reference to the CODE input of this row
    const codeInput = getInputRef({ rowIndex, colIndex: 0 });

    // If input doesn't exist yet, bail out
    if (!codeInput) return;

    // If code field is empty → move focus back to code
    if (codeInput.value.trim() === "") {
      setFocusedInput({ rowIndex, colIndex: 0 });
    }
  }, [focusedInput, rows]);

  return HybridColumn<ProductInOrder>({
    header: "Quantità",
    sortable: false,
    value: (row, meta) => {
      const pending = rows[row.index]?.quantity;
      const value = pending !== undefined ? pending : row.original.quantity;

      const interactionReady = (meta as OrderTableMeta).interactionReady ?? true;
      const finalizeRowUpdate = (meta as OrderTableMeta).finalizeRowUpdate;

      const rowIndex = row.index;

      return (
        <div className="flex gap-2 items-center">
          <QuantityArrow
            disabled={!interactionReady}
            onClick={() =>
              handleQuantityArrows(QuantityChangeDir.DOWN, rowIndex, finalizeRowUpdate)
            }
            label="-1"
          />

          <Input
            disabled={!interactionReady}
            ref={(ref) => addInputRef(ref, { rowIndex: rowIndex, colIndex: 1 })}
            defaultValue={value}
            className="max-w-20 !text-2xl uppercase w-20"
            autoFocus={focusedInput.rowIndex === rowIndex && focusedInput.colIndex === 1}
            onClick={() => handleOnClick(rowIndex)}
            onKeyDown={(e) => handleOnKeyDown(e, rowIndex, finalizeRowUpdate)}
            type="number"
          />

          <QuantityArrow
            disabled={!interactionReady}
            onClick={() => handleQuantityArrows(QuantityChangeDir.UP, rowIndex, finalizeRowUpdate)}
            label="+1"
          />
        </div>
      );
    },
    accessor: (pio) => pio.quantity,
  });
}
