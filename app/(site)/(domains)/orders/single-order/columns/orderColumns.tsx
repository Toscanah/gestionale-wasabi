import { ColumnDef } from "@tanstack/react-table";
import { ProductInOrder } from "@/app/(site)/lib/shared";
import { Input } from "@/components/ui/input";
import { ActionColumn, HybridColumn, ValueColumn } from "../../../../components/table/TableColumns";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import useGridFocus, { FocussableInput } from "../../../../hooks/focus/useGridFocus";
import { Button } from "@/components/ui/button";
import { debounce } from "lodash";
import { useOrderContext } from "../../../../context/OrderContext";
import capitalizeFirstLetter from "../../../../lib/utils/global/string/capitalizeFirstLetter";
import toEuro from "@/app/(site)/lib/utils/global/string/toEuro";
import { OrderTableMeta } from "../OrderTable";
import CodeColumn from "./CodeColumn";
import QuantityColumn from "./QuantityColumn";

export interface CommonColumnProps {
  addInputRef: (ref: HTMLInputElement | null, newInput: FocussableInput) => void;
  setFocusedInput: (input: FocussableInput) => void;
  handleKeyNavigation: (
    e: React.KeyboardEvent<HTMLInputElement>,
    currentInput: FocussableInput
  ) => void;
  rows: Record<number, { code?: string; quantity?: number }>;
  setRowValue: (rowIndex: number, field: "code" | "quantity", value: any) => void;
}

export default function orderColumns({
  defaultFocusedInput,
  rows,
  setRowValue,
}: {
  defaultFocusedInput: FocussableInput;
  rows: Record<number, { code?: string; quantity?: number }>;
  setRowValue: (rowIndex: number, field: "code" | "quantity", value: any) => void;
}): ColumnDef<ProductInOrder>[] {
  const { updateProductOption: selectOption, updateProductVariation } = useOrderContext();

  const { getInputRef, addInputRef, setFocusedInput, handleKeyNavigation, focusedInput } =
    useGridFocus(defaultFocusedInput, 1);

  const debouncedVariationChange = debounce(
    (variation: string, productInOrderId: number) =>
      updateProductVariation(variation, productInOrderId),
    1500
  );

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

    CodeColumn({
      addInputRef,
      setFocusedInput,
      handleKeyNavigation,
      rows,
      setRowValue,
    }),

    QuantityColumn({
      addInputRef,
      setFocusedInput,
      handleKeyNavigation,
      rows,
      setRowValue,
      focusedInput,
      getInputRef,
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
          <div className="flex flex-col gap-2 h-24 overflow-y-auto">
            {avalOptions.map((option) => (
              <div key={option.option.id} className="flex items-center space-x-2">
                <Checkbox
                  defaultChecked={selectedOptions.includes(option.option.id)}
                  onCheckedChange={() => selectOption(row.original.id, option.option.id)}
                  id={`option-${option.option.id}-${row.index}`}
                />
                <Label
                  htmlFor={`option-${option.option.id}-${row.index}`}
                  className="text-lg font-medium"
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
        pio.variation + " " + pio.options.map((el) => el.option.option_name).join(", "),
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
        const total = row.original.frozen_price * row.original.quantity;
        return <span className="text-2xl">{total === 0 ? "" : toEuro(total)}</span>;
      },
      accessor: (pio) => pio.frozen_price * pio.quantity,
    }),
  ];
}
