import { ColumnDef } from "@tanstack/react-table";
import { ProductInOrderType } from "../../types/ProductInOrderType";
import { Input } from "@/components/ui/input";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { TypesOfOrder } from "../../types/TypesOfOrder";
import TableColumn from "../../components/TableColumn";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";

export default function getColumns(
  handleFieldChange: (key: string, value: any, index: number) => void,
  type: TypesOfOrder,
  focusedInput: { rowIndex: number; colIndex: number },
  setFocusedInput: Dispatch<SetStateAction<{ rowIndex: number; colIndex: number }>>
): ColumnDef<ProductInOrderType>[] {
  const inputRefs = useRef<Map<string, HTMLInputElement | null>>(new Map()).current;

  useEffect(() => {
    moveToInput(focusedInput.rowIndex, focusedInput.colIndex);
  }, [focusedInput]);

  const handleKeyNavigation = (
    e: React.KeyboardEvent<HTMLInputElement>,
    rowIndex: number,
    colIndex: number
  ) => {
    const keyActions: Record<string, () => void> = {
      Enter: () => {
        if (colIndex === 1) {
          moveToInput(rowIndex + 1, 0);
          setFocusedInput({ rowIndex: rowIndex + 1, colIndex: 0 });
        } else {
          moveToInput(rowIndex, colIndex + 1);
          setFocusedInput({ rowIndex, colIndex: colIndex + 1 });
        }
      },
      ArrowRight: () => {
        if (colIndex === 1) {
          moveToInput(rowIndex + 1, 0);
          setFocusedInput({ rowIndex: rowIndex + 1, colIndex: 0 });
        } else {
          moveToInput(rowIndex, colIndex + 1);
          setFocusedInput({ rowIndex, colIndex: colIndex + 1 });
        }
      },
      ArrowDown: () => {
        moveToInput(rowIndex + 1, colIndex);
        setFocusedInput({ rowIndex: rowIndex + 1, colIndex });
      },
      ArrowUp: () => {
        moveToInput(rowIndex - 1, colIndex);
        setFocusedInput({ rowIndex: rowIndex - 1, colIndex });
      },
      ArrowLeft: () => {
        if (colIndex === 0) {
          moveToInput(rowIndex - 1, 1);
          setFocusedInput({ rowIndex: rowIndex - 1, colIndex: 1 });
        } else {
          moveToInput(rowIndex, colIndex - 1);
          setFocusedInput({ rowIndex, colIndex: colIndex - 1 });
        }
      },
    };

    if (keyActions[e.key]) {
      e.preventDefault();
      keyActions[e.key]();
    }
  };

  const moveToInput = (rowIndex: number, colIndex: number) => {
    const refKey = `${rowIndex}-${colIndex}`;
    inputRefs.get(refKey)?.focus();
    inputRefs.get(refKey)?.select();
  };

  const setInputRef = (ref: HTMLInputElement | null, rowIndex: number, colIndex: number) => {
    const refKey = `${rowIndex}-${colIndex}`;
    if (ref) {
      inputRefs.set(refKey, ref);
    } else {
      inputRefs.delete(refKey);
    }
  };

  return [
    TableColumn<ProductInOrderType>({
      sortable: false,
      accessorKey: "lock-unlock-code",
      header: "",
      cellContent: (row) =>
        row.original.product_id !== -1 && (
          <Switch
            defaultChecked={false}
            onCheckedChange={() => {
              const codeField = inputRefs.get(`${row.index}-${0}`);
              if (codeField) {
                codeField.disabled = !codeField.disabled;
              }
            }}
          />
        ),
    }),

    TableColumn<ProductInOrderType>({
      accessorKey: "code",
      header: "Codice",
      cellContent: (row) => (
        <Input
          onClick={() => setFocusedInput({ rowIndex: row.index, colIndex: 0 })}
          ref={(ref) => setInputRef(ref, row.index, 0)}
          className="max-w-28 text-2xl uppercase"
          defaultValue={row.original.product?.code ?? ""}
          disabled={row.original.id !== -1}
          autoFocus={
            row.original.product_id == -1
            // &&
            // focusedInput.rowIndex === row.index &&
            // focusedInput.colIndex === 0
          }
          onKeyDown={(e: any) => {
            handleKeyNavigation(e, row.index, 0);
            if (e.key === "Enter") {
              handleFieldChange("code", e.target.value, row.index);
            }
          }}
        />
      ),
    }),
    
    TableColumn<ProductInOrderType>({
      accessorKey: "quantity",
      header: "Quantità",
      cellContent: (row) => (
        <Input
          ref={(ref) => setInputRef(ref, row.index, 1)}
          type="number"
          className="max-w-20 text-2xl uppercase"
          autoFocus={focusedInput.rowIndex === row.index && focusedInput.colIndex === 1}
          defaultValue={row.original.quantity == 0 ? 1 : row.original.quantity}
          onClick={() => setFocusedInput({ rowIndex: row.index, colIndex: 1 })}
          onKeyDown={(e: any) => {
            handleKeyNavigation(e, row.index, 1);
            if (e.key === "Enter") {
              handleFieldChange("quantity", e.target.value, row.index);
            }
          }}
        />
      ),
    }),

    TableColumn<ProductInOrderType>({
      accessorKey: "desc",
      header: "Descrizione",
      cellContent: (row) => (
        <div className="flex items-center justify-start overflow-hidden text-ellipsis w-full text-2xl">
          {row.original.product?.desc}
        </div>
      ),
    }),

    TableColumn<ProductInOrderType>({
      accessorKey: "options",
      header: "Opzioni",
      cellContent: (row) => {
        console.log(row.original)
        const options = row.original.product?.category?.options;

        return (
          <div className="space-y-2">
            {options && options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox />
                <label
                  htmlFor="terms"
                  className="text-lg font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {option.option.option_name}
                </label>
              </div>
            ))}
          </div>
        );
      },
    }),

    TableColumn<ProductInOrderType>({
      accessorKey: "price",
      header: "Unità",
      cellContent: (row) => (
        <>
          {row.original.product?.home_price == 0 && row.original.product.site_price == 0
            ? ""
            : `€ ${
                type == TypesOfOrder.TO_HOME
                  ? row.original.product.home_price
                  : row.original.product.site_price
              }`}
        </>
      ),
    }),

    TableColumn<ProductInOrderType>({
      accessorKey: "total",
      header: "Totale",
      cellContent: (row) => (row.original.total == 0 ? "" : `€ ${row.original.total}`),
    }),

    TableColumn<ProductInOrderType>({
      accessorKey: "select",
      header: "Seleziona",
      sortable: false,
      cellContent: (row) =>
        row.original.product_id !== -1 && (
          <div className="flex justify-center items-center">
            <Checkbox
            className="h-6 w-6"
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              aria-label="Select row"
            />
          </div>
        ),
    }),
  ];
}
