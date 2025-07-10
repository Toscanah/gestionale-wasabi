import { useOrderContext } from "@/app/(site)/context/OrderContext";
import fetchRequest from "@/app/(site)/lib/api/fetchRequest";
import calculateExtraItems from "@/app/(site)/lib/services/order-management/calculateExtraItems";
import { toastSuccess } from "@/app/(site)/lib/utils/toast";
import useFocusOnClick from "@/app/(site)/hooks/useFocusOnClick";
import useLocalExtraItems from "@/app/(site)/hooks/useLocalExtraItems";
import { AnyOrder } from "@/app/(site)/lib/shared"
;
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { debounce } from "lodash";
import { useCallback, useEffect, useState } from "react";

interface ExtraItemProps {
  label: string;
  computedValue: number;
  stateValue: number;
  onValueChange: (newValue: number) => void;
}

export type ExtraItems = "salads" | "soups" | "rices";

const ExtraItem = ({ label, computedValue, stateValue, onValueChange }: ExtraItemProps) => (
  <div className="flex gap-4 items-center h-full">
    <div className="flex flex-col items-center gap-2">
      <span className="text-xl font-bold">{label}</span>
    </div>

    <Separator orientation="vertical" />

    <table className="w-full text-left">
      <tbody>
        <tr className="">
          <td className="py-2">Calcolato:</td>
          <td className="py-2 pl-4">
            <Input
              id={"computed-" + label}
              value={computedValue}
              disabled
              className="h-10 text-center text-xl max-w-40"
            />
          </td>
        </tr>

        <tr>
          <td className="py-2">Manuale:</td>
          <td className="py-2 pl-4">
            <div className="flex items-center gap-2">
              <Button
                disabled={stateValue == 0}
                className="h-10 w-10"
                variant="outline"
                onClick={() => onValueChange(Math.max(0, stateValue - 1))}
              >
                -1
              </Button>

              <Input
                id={label}
                value={stateValue}
                onChange={(e) => onValueChange(Number(e.target.value) || 0)}
                className="h-10 w-16 text-center text-xl"
              />

              <Button
                className="h-10 w-10"
                variant="outline"
                onClick={() => onValueChange(stateValue + 1)}
              >
                +1
              </Button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
);

export default function ExtraItems() {
  const { order, updateOrder } = useOrderContext();
  const [salads, setSalads] = useState(0);
  const [rices, setRices] = useState(0);
  const [soups, setSoups] = useState(0);

  const {
    soupsFromProducts,
    saladsFromProducts,
    ricesFromProducts,
    soupsFinal,
    saladsFinal,
    ricesFinal,
  } = calculateExtraItems(order);

  useFocusOnClick(["Zuppe", "Insalate", "Riso"]);
  useLocalExtraItems();

  useEffect(() => {
    setRices(ricesFinal);
    setSalads(saladsFinal);
    setSoups(soupsFinal);
  }, [order.products]);

  const updateOrderExtraItems = (items: ExtraItems, value: number, order: AnyOrder) => {
    const { soupsFromProducts, saladsFromProducts, ricesFromProducts } = calculateExtraItems(order);

    const computedValue =
      items === "soups"
        ? soupsFromProducts
        : items === "salads"
        ? saladsFromProducts
        : ricesFromProducts;

    const newValue = value === computedValue ? null : value;

    fetchRequest("PATCH", "/api/orders/", "updateOrderExtraItems", {
      orderId: order.id,
      items,
      value: newValue,
    }).then(() => {
      updateOrder({ [items]: newValue });
      toastSuccess("Zuppe, insalate e risi aggiornati correttamente");
    });
  };

  const debouncedUpdateOrderExtraItems = useCallback(
    debounce(
      (items: ExtraItems, value: number, order: AnyOrder) =>
        updateOrderExtraItems(items, value, order),
      1000
    ),
    []
  );

  const handleManualChange = (type: ExtraItems, value: number) => {
    if (type === "salads") setSalads(value);
    if (type === "soups") setSoups(value);
    if (type === "rices") setRices(value);

    debouncedUpdateOrderExtraItems(type, value, order);
  };

  return (
    <div className="h-24 w-full flex items-center justify-between">
      <ExtraItem
        computedValue={soupsFromProducts}
        label="Zuppe"
        stateValue={soups}
        onValueChange={(val) => handleManualChange("soups", val)}
      />

      <ExtraItem
        computedValue={saladsFromProducts}
        label="Insalate"
        stateValue={salads}
        onValueChange={(val) => handleManualChange("salads", val)}
      />

      <ExtraItem
        computedValue={ricesFromProducts}
        label="Riso"
        stateValue={rices}
        onValueChange={(val) => handleManualChange("rices", val)}
      />
    </div>
  );
}
