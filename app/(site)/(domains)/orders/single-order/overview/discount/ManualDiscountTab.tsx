import WasabiAnimatedTab from "@/app/(site)/components/ui/wasabi/WasabiAnimatedTab";
import { DiscountsSummary, DiscountTabs } from "./DiscountsDialog";
import { Label } from "@/components/ui/label";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { Separator } from "@/components/ui/separator";
import { useMemo, useState, useEffect } from "react";
import { getOrderTotal } from "@/app/(site)/lib/services/order-management/getOrderTotal";
import { Button } from "@/components/ui/button";
import { useOrderContext } from "@/app/(site)/context/OrderContext";
import { PromotionType } from "@prisma/client";
import { PromotionByType, PromotionGuards } from "@/app/(site)/lib/shared";
import { ButtonGroup, ButtonGroupText } from "@/components/ui/button-group";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRightIcon } from "@phosphor-icons/react";
import toEuro from "@/app/(site)/lib/utils/global/string/toEuro";
import useFocusOnClick from "@/app/(site)/hooks/focus/useFocusOnClick";

interface ManualDiscountTabProps {
  activeTab: DiscountTabs;
}

export default function ManualDiscountTab({ activeTab }: ManualDiscountTabProps) {
  const { updateOrderDiscount, order } = useOrderContext();
  const [manualDiscount, setManualDiscount] = useState<number | "">(order.discount ?? "");

  const subtotal = useMemo(() => getOrderTotal({ order, applyDiscounts: false }), [order]);
  const cappedDiscount = Math.min(Math.max(Number(manualDiscount), 0), 100);
  const discountValue = Math.min((subtotal * cappedDiscount) / 100, subtotal);

  useEffect(() => {
    setManualDiscount(order.discount ?? 0);
  }, [activeTab]);

  const manualOnlyTotal = useMemo(
    () => getOrderTotal({ order, applyDiscounts: false }) * (1 - cappedDiscount / 100),
    [order, cappedDiscount]
  );

  useFocusOnClick(["manual-discount-input"]);

  return (
    <WasabiAnimatedTab
      value="manual-discount"
      currentValue={activeTab}
      className="flex flex-col gap-4 mt-2"
    >
      <ButtonGroup className="w-full py-1">
        <ButtonGroupText asChild>
          <Label htmlFor="manual-discount-input">Sconto</Label>
        </ButtonGroupText>

        <InputGroup>
          <InputGroupInput
            id="manual-discount-input"
            type="number"
            min={0}
            max={100}
            step={1}
            value={manualDiscount}
            onChange={(e) => {
              const val = e.target.value;
              setManualDiscount(val === "" ? "" : Math.min(Math.max(Number(val), 0), 100));
            }}
            className="w-full"
          />
          <InputGroupAddon align="inline-start">
            <InputGroupText className="text-sm font-medium">%</InputGroupText>
          </InputGroupAddon>
        </InputGroup>

        <Button
          onClick={() => updateOrderDiscount(Number(manualDiscount) || 0)}
          disabled={
            manualDiscount === "" ||
            isNaN(Number(manualDiscount)) ||
            Number(manualDiscount) === (order.discount ?? 0)
          }
        >
          Applica
        </Button>
      </ButtonGroup>

      {manualDiscount == 0 && <Separator />}

      {discountValue > 0 && (
        <>
          <Card className="p-2">
            <CardContent className="p-2 flex justify-around text-sm items-center">
              <div>
                Totale parziale: <span className="font-mono font-semibold">{toEuro(subtotal)}</span>
              </div>

              <ArrowRightIcon />

              <div>
                Sconto:{" "}
                <span className="font-mono font-semibold text-orange-600">
                  −{toEuro(discountValue)}
                </span>
              </div>
              <ArrowRightIcon />
              <div>
                Totale solo sconto:{" "}
                <span className="font-mono font-semibold text-green-600">
                  {toEuro(manualOnlyTotal)}
                </span>
              </div>
            </CardContent>
          </Card>

          <Separator />
        </>
      )}

      <DiscountsSummary liveOrder={{ ...order, discount: cappedDiscount }} />
    </WasabiAnimatedTab>
  );
}
