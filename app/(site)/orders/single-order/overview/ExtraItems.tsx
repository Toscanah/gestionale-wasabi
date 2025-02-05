import { useOrderContext } from "@/app/(site)/context/OrderContext";
import fetchRequest from "@/app/(site)/functions/api/fetchRequest";
import { toastSuccess } from "@/app/(site)/functions/util/toast";
import useFocusOnClick from "@/app/(site)/hooks/useFocusOnClick";
import { ProductInOrder } from "@/app/(site)/models";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ArrowCounterClockwise } from "@phosphor-icons/react";
import { debounce } from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";

interface ExtraItemProps {
  label: string;
  computedValue: number;
  stateValue: number;
  onValueChange: (newValue: number) => void;
  // handleItemReset: () => void;
}

export type ExtraItems = "salads" | "soups" | "rices";

const ExtraItem = ({
  label,
  computedValue,
  stateValue,
  onValueChange,
  // handleItemReset,
}: ExtraItemProps) => (
  <div className="flex gap-4 items-center h-full">
    <div className="flex flex-col items-center gap-2">
      <span className="text-xl font-bold">{label}</span>
      {/* <span
        className="text-xs hover:underline hover:cursor-pointer text-muted-foreground"
        onClick={handleItemReset}
      >
        (reimposta)
      </span> */}
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

  // const handleItemReset = (item: ExtraItems) => {
  //   const computedSalads = computeExtraItems("salads");
  //   const computedSoups = computeExtraItems("soups");
  //   const computedRices = computeExtraItems("rices");

  //   if (item === "salads") {
  //     setSalads(computedSalads);
  //   }
  //   if (item === "soups") {
  //     setSoups(computedSoups);
  //   }

  //   if (item === "rices") {
  //     setRices(computedRices);
  //   }

  //   debouncedUpdateOrderExtraItems(item, 0);
  // };

  console.log("Sup")

  const computeExtraItems = (key: "rices" | "salads" | "soups") =>
    order.products.reduce((sum, p) => sum + (p.product[key] || 0) * p.quantity, 0);

  const computedRices = computeExtraItems("rices");
  const computedSalads = computeExtraItems("salads");
  const computedSoups = computeExtraItems("soups");

  useFocusOnClick(["Zuppe", "Insalate", "Riso"]);

  useEffect(() => {
    setRices(order.rices ?? computedRices);
    setSalads(order.salads ?? computedSalads);
    setSoups(order.soups ?? computedSoups);
  }, [order.products]);

  const updateOrderExtraItems = (items: ExtraItems, value: number) =>
    fetchRequest("POST", "/api/orders/", "updateOrderExtraItems", {
      orderId: order.id,
      items,
      value,
    }).then(() => {
      updateOrder({ [items]: value });
      toastSuccess("Zuppe, insalate e risi aggiornati correttamente");
    });

  const debouncedUpdateOrderExtraItems = useCallback(
    debounce((items: ExtraItems, value: number) => updateOrderExtraItems(items, value), 1000),
    []
  );

  const handleManualChange = (type: ExtraItems, value: number) => {
    if (type === "salads") setSalads(value);
    if (type === "soups") setSoups(value);
    if (type === "rices") setRices(value);

    debouncedUpdateOrderExtraItems(type, value);
  };

  return (
    <div className="h-24 w-full flex items-center justify-between">
      <ExtraItem
        computedValue={computedSoups}
        // handleItemReset={() => handleItemReset("soups")}
        label="Zuppe"
        stateValue={soups}
        onValueChange={(val) => handleManualChange("soups", val)}
      />
      {/* <Separator orientation="horizontal" className="max-w-8 mx-16" /> */}
      <ExtraItem
        computedValue={computedSalads}
        // handleItemReset={() => handleItemReset("salads")}
        label="Insalate"
        stateValue={salads}
        onValueChange={(val) => handleManualChange("salads", val)}
      />
      {/* <Separator orientation="horizontal" className="max-w-8 mx-16" /> */}
      <ExtraItem
        computedValue={computedRices}
        // handleItemReset={() => handleItemReset("rices")}
        label="Riso"
        stateValue={rices}
        onValueChange={(val) => handleManualChange("rices", val)}
      />
    </div>
  );
}
