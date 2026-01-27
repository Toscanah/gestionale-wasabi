import { ValueColumn } from "@/components/table/TableColumns";
import { ProductInOrder } from "@/lib/shared";
import { OrderTableMeta } from "../OrderTable";
import { Input } from "@/components/ui/input";
import { CommonColumnProps } from "./orderColumns";
import { isArrows, isArrowsNotSubmit, isSubmit } from "@/lib/shared/utils/global/keyboard";

export default function CodeColumn({
  addInputRef,
  setFocusedInput,
  handleKeyNavigation,
  rows,
  setRowValue,
}: CommonColumnProps) {
  const handleOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, rowIndex: number) => {
    if (isArrowsNotSubmit(e)) {
      return handleKeyNavigation(e, { rowIndex, colIndex: 0 });
    }

    const value = e.currentTarget.value ?? "";

    if (!isSubmit(e) || value === "") return;

    const v = value.toUpperCase();
    setRowValue(rowIndex, "code", v);
    handleKeyNavigation(e, { rowIndex, colIndex: 0 });
  };

  const handleOnClick = (rowIndex: number) => {
    setFocusedInput({ rowIndex, colIndex: 0 });
  };

  return ValueColumn<ProductInOrder>({
    header: "Codice",
    sortable: false,
    value: (row, meta) => {
      const interactionReady = (meta as OrderTableMeta).interactionReady ?? true;

      const pending = rows[row.index]?.code;
      const initialValue = pending !== undefined ? pending : (row.original.product?.code ?? "");

      const rowIndex = row.index;

      return (
        <Input
          disabled={!interactionReady}
          ref={(ref) => addInputRef(ref, { rowIndex: rowIndex, colIndex: 0 })}
          defaultValue={initialValue}
          className="max-w-32 w-32 !text-2xl uppercase"
          autoFocus={row.original.product_id == -1}
          onClick={() => handleOnClick(rowIndex)}
          onKeyDown={(e) => handleOnKeyDown(e, rowIndex)}
        />
      );
    },
    accessor: (pio) => pio.product?.code,
  });
}
