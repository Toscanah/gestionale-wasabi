"use client";

import WasabiDialog from "@/app/(site)/components/ui/wasabi/WasabiDialog";
import { getOrderTotal } from "@/app/(site)/lib/services/order-management/getOrderTotal";
import { OrderByType } from "@/app/(site)/lib/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useMemo } from "react";
import WasabiAnimatedTab from "../../../components/ui/wasabi/WasabiAnimatedTab";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";

interface OrderPromotionDialogProps {
  order: OrderByType;
}

export default function OrderPromotionDialog({ order }: OrderPromotionDialogProps) {
  const [manualDiscount, setManualDiscount] = useState(order.discount ?? 0);
  const [activeTab, setActiveTab] = useState<"manual-discount" | "promotions">("manual-discount");

  // 🧮 Compute subtotal (without discounts)
  const subtotal = useMemo(() => getOrderTotal({ order, applyDiscounts: false }), [order]);

  // 🧮 Cap discount % between 0–100
  const cappedDiscount = Math.min(Math.max(manualDiscount, 0), 100);

  // 🧮 Compute discount € and final total
  const discountValue = Math.min((subtotal * cappedDiscount) / 100, subtotal);
  const finalTotal = getOrderTotal({
    order: { ...order, discount: cappedDiscount },
    applyDiscounts: true,
  });

  return (
    <WasabiDialog trigger={<Button>PROMO</Button>} title="Promozioni per l'ordine">
      <Tabs
        defaultValue="manual-discount"
        value={activeTab}
        onValueChange={(val) => setActiveTab(val as any)}
        className="w-full"
      >
        <TabsList className="w-full">
          <TabsTrigger value="manual-discount">Sconto manuale</TabsTrigger>
          <TabsTrigger value="promotions">Promozioni</TabsTrigger>
        </TabsList>

        <WasabiAnimatedTab
          value="manual-discount"
          currentValue={activeTab}
          className="flex flex-col gap-4 mt-2"
        >
          <div className="space-y-2">
            <Label htmlFor="manual-discount-input">Sconto manuale</Label>
            <InputGroup>
              <InputGroupInput
                id="manual-discount-input"
                type="number"
                min={0}
                max={100}
                step={1}
                value={manualDiscount}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setManualDiscount(Math.min(Math.max(val, 0), 100));
                }}
                className="w-full"
                placeholder="0–100"
              />
              <InputGroupAddon align="inline-end">
                <InputGroupText className="text-sm font-medium">0 - 100 (%)</InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </div>

          <Separator />

          <span className="text-lg">
            Totale parziale: <span className="font-mono">€ {subtotal.toFixed(2)} €</span>
          </span>

          <span className="text-lg">
            Sconto: <span className="font-mono">-{discountValue.toFixed(2)} €</span>
          </span>

          <span className="text-lg font-semibold">
            Totale con sconto: <span className="font-mono">{finalTotal.toFixed(2)} €</span>
          </span>

          <Separator />

          <Button className="w-full">Applica sconto</Button>
        </WasabiAnimatedTab>

        <TabsContent value="promotions">{/* future promo UI */}</TabsContent>
      </Tabs>
    </WasabiDialog>
  );
}
