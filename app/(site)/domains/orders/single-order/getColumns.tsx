import { ColumnDef } from "@tanstack/react-table";
import { ProductInOrder } from "@/app/(site)/lib/shared";
import { Input } from "@/components/ui/input";
import { OrderType } from "@prisma/client";
import TableColumn from "../../../components/table/TableColumn";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import useGridFocus, { FocussableInput } from "../../../hooks/useGridFocus";
import { Button } from "@/components/ui/button";
import { debounce } from "lodash";
import { useOrderContext } from "../../../context/OrderContext";
import capitalizeFirstLetter from "../../../lib/formatting-parsing/capitalizeFirstLetter";
import roundToTwo from "../../../lib/formatting-parsing/roundToTwo";

export default function getColumns(
  handleFieldChange: (key: "code" | "quantity", value: any, index: number) => void,
  type: OrderType,
  defaultFocusedInput: FocussableInput
): ColumnDef<ProductInOrder>[] {
  const { updateProductOption: selectOption, updateAddionalNote } = useOrderContext();

  const { getInputRef, addInputRef, setFocusedInput, handleKeyNavigation, focusedInput } =
    useGridFocus(defaultFocusedInput, 1);

  const debouncedFieldChange = debounce(
    (newValue: number, rowIndex: number) => handleFieldChange("quantity", newValue, rowIndex),
    0
  );

  const debouncedAddNoteChange = debounce(
    (note: string, productInOrderId: number) => updateAddionalNote(note, productInOrderId),
    1500
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
    TableColumn<ProductInOrder>({
      header: "",
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

    TableColumn<ProductInOrder>({
      header: "Codice",
      sortable: false,
      cellContent: (row) => (
        <Input
          onClick={() => setFocusedInput({ rowIndex: row.index, colIndex: 0 })}
          ref={(ref) => addInputRef(ref, { rowIndex: row.index, colIndex: 0 })}
          className="max-w-32 w-32 text-2xl uppercase"
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
              if (
                (e.key === "Enter" || e.key === "ArrowRight") &&
                row.original.product.code !== inputValue
              ) {
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

    TableColumn<ProductInOrder>({
      header: "Quantità",
      sortable: false,
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
            type="text"
            className="max-w-20 text-2xl uppercase"
            autoFocus={focusedInput.rowIndex === row.index && focusedInput.colIndex === 1}
            defaultValue={row.original.quantity == 0 ? 1 : row.original.quantity}
            onKeyDown={(e: any) => {
              const currentInput = getInputRef({ rowIndex: row.index, colIndex: 1 });
              const inputValue = Number(currentInput?.value) || 0;

              handleKeyNavigation(e, { rowIndex: row.index, colIndex: 1 });
              if (
                (e.key === "Enter" || e.key === "ArrowRight") &&
                row.original.quantity !== inputValue
              ) {
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

    TableColumn<ProductInOrder>({
      header: "Descrizione",
      sortable: false,
      cellContent: (row) => (
        <div className="flex items-center justify-start overflow-hidden text-ellipsis w-full text-2xl">
          {row.original.product?.desc}
        </div>
      ),
    }),

    TableColumn<ProductInOrder>({
      header: "Opzioni",
      sortable: false,
      cellContent: (row) => {
        if (row.original.product_id == -1) return <></>;

        const avalOptions = row.original.product?.category?.options ?? [];
        const selectedOptions = row.original.options?.map((el) => el.option.id) ?? [];

        return (
          <div className="space-y-2 h-24 overflow-y-auto">
            {avalOptions &&
              avalOptions.map((option) => (
                <div
                  key={option.option.id}
                  className="flex items-center space-x-2 max-h-20 overflow-y-visible"
                >
                  <Checkbox
                    defaultChecked={selectedOptions.includes(option.option.id)}
                    onCheckedChange={(e) => {
                      selectOption(row.original.id, option.option.id);
                      // setFocusedInput({ rowIndex: row.index, colIndex: 1 });
                    }}
                    id={`option-${option.option.id}-${row.index}`}
                  />
                  <Label
                    htmlFor={`option-${option.option.id}-${row.index}`}
                    className="text-lg font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {capitalizeFirstLetter(option.option.option_name)}
                  </Label>
                </div>
              ))}

            <Input
              type="text"
              defaultValue={row.original.additional_note ?? ""}
              onChange={(e) => debouncedAddNoteChange(e.target.value, row.original.id)}
            />
          </div>
        );
      },
    }),

    TableColumn<ProductInOrder>({
      header: "Unità",
      sortable: false,
      cellContent: (row) => (
        <span className="text-2xl">
          {row.original.product?.home_price == 0 && row.original.product.site_price == 0
            ? ""
            : `€ ${roundToTwo(row.original.frozen_price)}`}
        </span>
      ),
    }),

    TableColumn<ProductInOrder>({
      header: "Totale",
      sortable: false,
      cellContent: (row) => {
        const product = row.original;
        const productTotal = product.frozen_price * product.quantity;

        return (
          <span className="text-2xl">
            {productTotal == 0 ? "" : `€ ${roundToTwo(productTotal)}`}
          </span>
        );
      },
    }),
  ];
}
