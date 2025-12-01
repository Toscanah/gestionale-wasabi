import { ColumnDef } from "@tanstack/react-table";
import { ProductInOrder } from "@/app/(site)/lib/shared";
import { Input } from "@/components/ui/input";
import { ActionColumn, HybridColumn, ValueColumn } from "../../../components/table/TableColumns";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import useGridFocus, { FocussableInput } from "../../../hooks/focus/useGridFocus";
import { Button } from "@/components/ui/button";
import { debounce } from "lodash";
import { useOrderContext } from "../../../context/OrderContext";
import capitalizeFirstLetter from "../../../lib/utils/global/string/capitalizeFirstLetter";
import roundToTwo from "../../../lib/utils/global/number/roundToTwo";
import toEuro from "@/app/(site)/lib/utils/global/string/toEuro";

export default function getColumns(
  handleFieldChange: (key: "code" | "quantity", value: any, index: number) => void,
  interactionReady: boolean,
  defaultFocusedInput: FocussableInput
): ColumnDef<ProductInOrder>[] {
  const { updateProductOption: selectOption, updateProductVariation } = useOrderContext();

  const { getInputRef, addInputRef, setFocusedInput, handleKeyNavigation, focusedInput } =
    useGridFocus(defaultFocusedInput, 1);

  const debouncedFieldChange = debounce(
    (newValue: number, rowIndex: number) => handleFieldChange("quantity", newValue, rowIndex),
    0
  );

  const debouncedVariationChange = debounce(
    (variation: string, productInOrderId: number) =>
      updateProductVariation(variation, productInOrderId),
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
    ActionColumn<ProductInOrder>({
      action: (row) =>
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

    ValueColumn<ProductInOrder>({
      header: "Codice",
      sortable: false,
      value: (row) => (
        <Input
          disabled={!interactionReady}
          onClick={() => setFocusedInput({ rowIndex: row.index, colIndex: 0 })}
          ref={(ref) => addInputRef(ref, { rowIndex: row.index, colIndex: 0 })}
          className="max-w-32 w-32 !text-2xl uppercase"
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
      accessor: (pio) => pio.product?.code,
    }),

    HybridColumn<ProductInOrder>({
      header: "Quantità",
      sortable: false,
      value: (row) => (
        <div className="flex gap-2 items-center">
          <Button
            disabled={!interactionReady}
            className="p-0 h-9 w-9"
            variant="outline"
            onClick={() => handleQuantityArrows("down", row.index)}
          >
            -1
          </Button>

          <Input
            disabled={!interactionReady}
            ref={(ref) => addInputRef(ref, { rowIndex: row.index, colIndex: 1 })}
            onClick={() => setFocusedInput({ rowIndex: row.index, colIndex: 1 })}
            type="text"
            className="max-w-20 !text-2xl uppercase w-20"
            autoFocus={focusedInput.rowIndex === row.index && focusedInput.colIndex === 1}
            defaultValue={row.original.quantity == 0 ? 1 : row.original.quantity}
            onKeyDown={(e: any) => {
              const currentInput = getInputRef({ rowIndex: row.index, colIndex: 1 });
              const inputValue = Number(currentInput?.value) || 0;

              const isEnter = e.key === "Enter" || e.key === "ArrowRight";
              const isArrows =
                e.key === "ArrowUp" || e.key === "ArrowDown" || e.key === "ArrowLeft";

              if ((isEnter || isArrows) && row.original.quantity === inputValue) {
                handleKeyNavigation(e, { rowIndex: row.index, colIndex: 1 });
              }

              if (isEnter && row.original.quantity !== inputValue) {
                handleFieldChange("quantity", e.target.value, row.index);
              }
            }}
          />

          <Button
            disabled={!interactionReady}
            className="p-0 h-9 w-9"
            variant="outline"
            onClick={() => handleQuantityArrows("up", row.index)}
          >
            +1
          </Button>
        </div>
      ),
      accessor: (pio) => pio.quantity,
    }),

    ValueColumn<ProductInOrder>({
      header: "Descrizione",
      sortable: false,
      value: (row) => (
        <div className="flex items-center justify-start overflow-hidden text-ellipsis w-full text-2xl">
          {row.original.product?.desc}
        </div>
      ),
      accessor: (pio) => pio.product?.desc,
    }),

    HybridColumn<ProductInOrder>({
      header: "Opzioni",
      sortable: false,
      value: (row) => {
        if (row.original.product_id == -1) return <></>;

        const avalOptions = row.original.product?.category?.options ?? [];
        const selectedOptions = row.original.options?.map((el) => el.option.id) ?? [];

        return (
          <div className="flex flex-col  gap-2 h-24 overflow-y-auto">
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
              className={avalOptions.length == 0 ? "my-auto" : ""}
              type="text"
              defaultValue={row.original.variation ?? ""}
              onChange={(e) => debouncedVariationChange(e.target.value, row.original.id)}
            />
          </div>
        );
      },
      accessor: (pio) =>
        pio.variation +
        " " +
        pio.options
          .sort((a, b) => a.option.option_name.localeCompare(b.option.option_name))
          .map((el) => el.option.option_name)
          .join(", "),
    }),

    ValueColumn<ProductInOrder>({
      header: "Unità",
      sortable: false,
      value: (row) => (
        <span className="text-2xl">
          {row.original.product?.home_price == 0 && row.original.product.site_price == 0
            ? ""
            : toEuro(row.original.frozen_price)}
        </span>
      ),
      accessor: (pio) => pio.frozen_price,
    }),

    ValueColumn<ProductInOrder>({
      header: "Totale",
      sortable: false,
      value: (row) => {
        const product = row.original;
        const productTotal = product.frozen_price * product.quantity;

        return <span className="text-2xl">{productTotal == 0 ? "" : toEuro(productTotal)}</span>;
      },
      accessor: (pio) => {
        const productTotal = pio.frozen_price * pio.quantity;
        return productTotal == 0 ? "" : toEuro(productTotal);
      },
    }),
  ];
}
