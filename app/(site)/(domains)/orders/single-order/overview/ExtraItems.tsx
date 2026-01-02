import { useOrderContext } from "@/app/(site)/context/OrderContext";
import calculateExtraItems from "@/app/(site)/lib/services/order-management/calculateExtraItems";
import { toastSuccess } from "@/app/(site)/lib/utils/global/toast";
import useFocusOnClick from "@/app/(site)/hooks/focus/useFocusOnClick";
import { OrderByType } from "@/app/(site)/lib/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { debounce } from "lodash";
import { useCallback, useEffect, useState } from "react";
import { trpc } from "@/lib/server/client";

interface ExtraItemProps {
  label: string;
  computedValue: number;
  stateValue: number;
  onValueChange: (newValue: number) => void;
}

export type ExtraItems = "salads" | "soups" | "rices";

export type ManualExtras = Record<ExtraItems, number>;

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
              className="h-10 text-center !text-xl max-w-40"
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
                className="h-10 w-16 text-center !text-xl"
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

  const {
    soupsFromProducts,
    saladsFromProducts,
    ricesFromProducts,
    soupsFinal,
    saladsFinal,
    ricesFinal,
  } = calculateExtraItems(order);

  useFocusOnClick(["Zuppe", "Insalate", "Riso"]);

  const [manualExtras, setManualExtras] = useState<ManualExtras>({
    soups: 0,
    salads: 0,
    rices: 0,
  });

  useEffect(() => {
    setManualExtras({
      soups: soupsFinal,
      salads: saladsFinal,
      rices: ricesFinal,
    });
  }, [order.products]);

  const updateExtraMutation = trpc.orders.updateExtraItems.useMutation();

  const debouncedUpdateAllExtras = useCallback(
    debounce((extras: ManualExtras, order: OrderByType) => {
      const { soupsFromProducts, saladsFromProducts, ricesFromProducts } =
        calculateExtraItems(order);

      const updates: Partial<Record<ExtraItems, number | null>> = {
        soups: extras.soups === soupsFromProducts ? null : extras.soups,
        salads: extras.salads === saladsFromProducts ? null : extras.salads,
        rices: extras.rices === ricesFromProducts ? null : extras.rices,
      };


      for (const [key, value] of Object.entries(updates)) {
        updateExtraMutation.mutate({
          orderId: order.id,
          items: key as ExtraItems,
          value,
        });
      }

      updateOrder(updates);
      toastSuccess("Zuppe, insalate e risi aggiornati correttamente");
    }, 1500),
    []
  );

  const handleManualChange = (type: ExtraItems, value: number) => {
    setManualExtras((prev) => {
      const updated = { ...prev, [type]: value };
      debouncedUpdateAllExtras(updated, order);
      return updated;
    });
  };

  return (
    <div className="h-24 w-full flex items-center justify-between">
      <ExtraItem
        computedValue={soupsFromProducts}
        label="Zuppe"
        stateValue={manualExtras.soups}
        onValueChange={(val) => handleManualChange("soups", val)}
      />

      <ExtraItem
        computedValue={saladsFromProducts}
        label="Insalate"
        stateValue={manualExtras.salads}
        onValueChange={(val) => handleManualChange("salads", val)}
      />

      <ExtraItem
        computedValue={ricesFromProducts}
        label="Riso"
        stateValue={manualExtras.rices}
        onValueChange={(val) => handleManualChange("rices", val)}
      />
    </div>
  );
}
