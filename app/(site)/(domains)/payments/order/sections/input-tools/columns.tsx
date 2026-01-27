import { Input } from "@/components/ui/input";
import { ColumnDef } from "@tanstack/react-table";
import useGridFocus from "@/hooks/focus/useGridFocus";
import roundToTwo from "@/lib/shared/utils/global/number/roundToTwo";
import { PaymentCalculation } from "@/context/OrderPaymentContext";
import { XIcon } from "@phosphor-icons/react";
import { Dispatch, SetStateAction } from "react";
import { ActionColumn, ValueColumn } from "@/components/table/TableColumns";
import toEuro from "@/lib/shared/utils/global/string/toEuro";

export default function getColumns(
  handleFieldChange: (key: keyof PaymentCalculation, value: number, rowIndex: number) => void,
  setPaymentCalculations: Dispatch<SetStateAction<PaymentCalculation[]>>
): ColumnDef<PaymentCalculation>[] {
  const { addInputRef, setFocusedInput, handleKeyNavigation } = useGridFocus(
    { rowIndex: 0, colIndex: 0 },
    1
  );

  return [
    ValueColumn({
      header: "Quantità",
      value: (row) => {
        const focussableInput = { rowIndex: row.index, colIndex: 0 };

        return (
          <Input
            type="number"
            onClick={() => setFocusedInput(focussableInput)}
            ref={(ref) => addInputRef(ref, focussableInput)}
            defaultValue={row.original.quantity}
            autoFocus={row.original.amount == 0}
            onKeyDown={(e: any) => {
              handleKeyNavigation(e, focussableInput);
              if (e.key === "Enter") {
                handleFieldChange("quantity", parseFloat(e.target.value), row.index);
              }
            }}
          />
        );
      },
      accessor: (pay) => pay.quantity,
    }),

    ValueColumn({
      header: "Ammontare",
      value: (row) => {
        const focussableInput = { rowIndex: row.index, colIndex: 1 };

        return (
          <Input
            type="number"
            defaultValue={row.original.amount}
            onClick={() => setFocusedInput(focussableInput)}
            ref={(ref) => addInputRef(ref, focussableInput)}
            onKeyDown={(e: any) => {
              handleKeyNavigation(e, focussableInput);
              if (e.key === "Enter") {
                handleFieldChange("amount", parseFloat(e.target.value), row.index);
              }
            }}
          />
        );
      },
      accessor: (pay) => pay.amount,
    }),

    ValueColumn({
      header: "Totale",
      value: (row) => toEuro(row.original.total),
      accessor: (pay) => pay.total,
    }),

    ActionColumn({
      action: (row) =>
        row.original.total !== 0 && (
          <XIcon
            size={24}
            className="hover:cursor-pointer"
            onClick={() =>
              setPaymentCalculations((prevCalculations) =>
                prevCalculations.filter((_, index) => index !== row.index)
              )
            }
          />
        ),
    }),
  ];
}
