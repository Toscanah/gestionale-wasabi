import { useOrderContext } from "@/app/(site)/context/OrderContext";
import fetchRequest from "@/app/(site)/functions/api/fetchRequest";
import { toastSuccess } from "@/app/(site)/functions/util/toast";
import useFocusOnClick from "@/app/(site)/hooks/useFocusOnClick";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { debounce } from "lodash";
import { useCallback, useEffect, useState } from "react";

interface ExtraItemProps {
  label: string;
  value: number;
  onValueChange: (newValue: number) => void;
}

export type ExtraItems = "salads" | "soups" | "rices";

const ExtraItem = ({ label, value, onValueChange }: ExtraItemProps) => (
  <>
    <Label className="text-xl">{label}</Label>
    <Button
      className="h-10 w-10"
      variant="outline"
      onClick={() => onValueChange(Math.max(0, value - 1))}
    >
      -1
    </Button>
    <Input
      id={label}
      value={value}
      onChange={(e) => onValueChange(Number(e.target.value) || 0)}
      className="h-12 text-xl"
    />
    <Button className="h-10 w-10" variant="outline" onClick={() => onValueChange(value + 1)}>
      +1
    </Button>
  </>
);

export default function ExtraItems() {
  const [salads, setSalads] = useState<number>(0);
  const [soups, setSoups] = useState<number>(0);
  const [rices, setRices] = useState<number>(0);
  const { order, updateOrder } = useOrderContext();

  useFocusOnClick(["Zuppe", "Insalate", "Riso"]);

  /** 🛠 Function to calculate extra items from products */
  const calculateExtraItemsFromProducts = () => ({
    salads: order.products.reduce((sum, p) => sum + (p.product.salads || 0), 0),
    soups: order.products.reduce((sum, p) => sum + (p.product.soups || 0), 0),
    rices: order.products.reduce((sum, p) => sum + (p.product.rices || 0), 0),
  });

  // 🛠 Reset to product values when products change
  useEffect(() => {

    const { salads, soups, rices } = calculateExtraItemsFromProducts();
    setSalads(order.salads ?? salads);
    setSoups(order.soups ?? soups);
    setRices(order.rices ?? rices);

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

  const onSaladsChange = (newSalads: number) => {
    setSalads(newSalads);
    debouncedUpdateOrderExtraItems("salads", newSalads);
  };

  const onSoupsChange = (newSoups: number) => {
    setSoups(newSoups);
    debouncedUpdateOrderExtraItems("soups", newSoups);
  };

  const onRicesChange = (newRices: number) => {
    setRices(newRices);
    debouncedUpdateOrderExtraItems("rices", newRices);
  };

  return (
    <div className="h-12 w-full flex gap-2 items-center">
      <ExtraItem label="Zuppe" value={soups} onValueChange={onSoupsChange} />
      <Separator orientation="horizontal" className="max-w-8 mx-16" />
      <ExtraItem label="Insalate" value={salads} onValueChange={onSaladsChange} />
      <Separator orientation="horizontal" className="max-w-8 mx-16" />
      <ExtraItem label="Riso" value={rices} onValueChange={onRicesChange} />
    </div>
  );
}
