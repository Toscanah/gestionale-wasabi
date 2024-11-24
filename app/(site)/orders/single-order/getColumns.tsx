import { ColumnDef } from "@tanstack/react-table";
import { ProductInOrderType } from "../../types/ProductInOrderType";
import { Input } from "@/components/ui/input";
import { OrderType } from "@prisma/client";
import TableColumn from "../../components/table/TableColumn";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import useGridFocus, { FocussableInput } from "../../components/hooks/useGridFocus";
import { Button } from "@/components/ui/button";
import { CaretDown, CaretUp } from "@phosphor-icons/react";
import { debounce } from "lodash";
import { getProductPrice } from "../../util/functions/getProductPrice";

export default function getColumns(
  handleFieldChange: (key: "code" | "quantity", value: any, index: number) => void,
  type: OrderType,
  selectOption: (productInOrderId: number, optionId: number) => void,
  defaultFocusedInput: FocussableInput
): ColumnDef<ProductInOrderType>[] {
  const { getInputRef, addInputRef, setFocusedInput, handleKeyNavigation, focusedInput } =
    useGridFocus(defaultFocusedInput, 1);

  const debouncedFieldChange = debounce(
    (newValue: number, rowIndex: number) => handleFieldChange("quantity", newValue, rowIndex),
    0
  );

  const handleQuantityArrows = (direction: "up" | "down", rowIndex: number) => {
    const inputRef = getInputRef({ rowIndex, colIndex: 1 });

    if (inputRef) {
      const currentValue = Number(inputRef.value) || 0;
      const newValue = direction === "up" ? currentValue + 1 : currentValue - 1;
      inputRef.value = newValue.toString();

      debouncedFieldChange(newValue, rowIndex);
    }
  };

  return [
    TableColumn<ProductInOrderType>({
      accessorKey: "code",
      header: "Codice",
      cellContent: (row) => (
        <Input
          onClick={() => setFocusedInput({ rowIndex: row.index, colIndex: 0 })}
          ref={(ref) => addInputRef(ref, { rowIndex: row.index, colIndex: 0 })}
          className="max-w-28 text-2xl uppercase"
          defaultValue={row.original.product?.code ?? ""}
          autoFocus={row.original.product_id == -1}
          onKeyDown={(e: any) => {
            const currentInput = getInputRef({ rowIndex: row.index, colIndex: 0 });
            const inputValue = currentInput?.value || "";

            if (inputValue === "") {
              if (e.key !== "Enter") {
                handleKeyNavigation(e, { rowIndex: row.index, colIndex: 0 });
              }
            } else {
              if (e.key === "Enter") {
                handleKeyNavigation(e, { rowIndex: row.index, colIndex: 0 });
                handleFieldChange("code", e.target.value, row.index);
              } else {
                handleKeyNavigation(e, { rowIndex: row.index, colIndex: 0 });
              }
            }
          }}
        />
      ),
    }),

    TableColumn<ProductInOrderType>({
      accessorKey: "quantity",
      header: "Quantità",
      cellContent: (row) => (
        <div className="flex gap-2 items-center">
          <Button
            className="p-0 h-10 w-10"
            variant="outline"
            onClick={() => handleQuantityArrows("down", row.index)}
          >
            -1
          </Button>

          <Input
            ref={(ref) => addInputRef(ref, { rowIndex: row.index, colIndex: 1 })}
            onClick={() => setFocusedInput({ rowIndex: row.index, colIndex: 1 })}
            type="number"
            className="max-w-20 text-2xl uppercase"
            autoFocus={focusedInput.rowIndex === row.index && focusedInput.colIndex === 1}
            defaultValue={row.original.quantity == 0 ? 1 : row.original.quantity}
            onKeyDown={(e: any) => {
              handleKeyNavigation(e, { rowIndex: row.index, colIndex: 1 });
              if (e.key === "Enter") {
                handleFieldChange("quantity", e.target.value, row.index);
              }
            }}
          />

          <Button
            className="p-0 h-10 w-10"
            variant="outline"
            onClick={() => handleQuantityArrows("up", row.index)}
          >
            +1
          </Button>
        </div>
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
        if (row.original.product_id == -1) return <></>;

        const avalOptions = row.original.product?.category?.options ?? [];
        const selectedOptions = row.original.options?.map((el) => el.option.id) ?? [];

        return (
          <div className="space-y-2 max-h-24 overflow-auto">
            {avalOptions &&
              avalOptions.map((option) => (
                <div key={option.option.id} className="flex items-center space-x-2">
                  <Checkbox
                    defaultChecked={selectedOptions.includes(option.option.id)}
                    onCheckedChange={(e) => selectOption(row.original.id, option.option.id)}
                    id={`option-${option.option.id}-${row.index}`}
                  />
                  <Label
                    htmlFor={`option-${option.option.id}-${row.index}`}
                    className="text-lg font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {option.option.option_name}
                  </Label>
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
        <span className="text-2xl">
          {row.original.product?.home_price == 0 && row.original.product.site_price == 0
            ? ""
            : `€ ${getProductPrice(row.original, type)}`}
        </span>
      ),
    }),

    TableColumn<ProductInOrderType>({
      accessorKey: "total",
      header: "Totale",
      cellContent: (row) => (
        <span className="text-2xl">{row.original.total == 0 ? "" : `€ ${row.original.total}`}</span>
      ),
    }),

    TableColumn<ProductInOrderType>({
      accessorKey: "select",
      header: "",
      sortable: false,
      cellContent: (row) =>
        row.original.product_id !== -1 && (
          <div className="flex justify-center items-center mr-4">
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
