"use client";

import WasabiAnimatedTab from "@/app/(site)/components/ui/wasabi/WasabiAnimatedTab";
import { DiscountsSummary, DiscountTabs } from "../DiscountsDialog";
import { Label } from "@/components/ui/label";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useOrderContext } from "@/app/(site)/context/OrderContext";
import { PromotionType } from "@/prisma/generated/client/enums";
import { Separator } from "@/components/ui/separator";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  PromotionByType,
  PromotionGuards,
  PromotionUsageWithPromotion,
} from "@/app/(site)/lib/shared";
import {
  PROMOTION_TYPES_COLORS,
  PROMOTION_TYPES_LABELS,
} from "@/app/(site)/lib/shared/constants/promotion-labels";
import usePromotionsFetcher from "@/app/(site)/hooks/promotions/usePromotionsFetcher";
import { ArrowRightIcon, CheckIcon, XIcon } from "@phosphor-icons/react";
import { Card, CardContent } from "@/components/ui/card";
import { debounce } from "lodash";
import { ButtonGroup, ButtonGroupText } from "@/components/ui/button-group";
import toEuro from "@/app/(site)/lib/utils/global/string/toEuro";
import { TrashIcon } from "@phosphor-icons/react/dist/ssr";
import { trpc } from "@/lib/server/client";
import { cn } from "@/lib/utils";
import QuickPromoPreview from "./QuickPromoPreview";
import { Badge } from "@/components/ui/badge";
import useFocusOnClick from "@/app/(site)/hooks/focus/useFocusOnClick";
import { getOrderTotal } from "@/app/(site)/lib/services/order-management/getOrderTotal";

interface PromotionsDiscountsTabProps {
  activeTab: DiscountTabs;
}

export default function PromotionsDiscountsTab({ activeTab }: PromotionsDiscountsTabProps) {
  const { applyPromotionToOrder, order, removePromotionFromOrder } = useOrderContext();
  const { promotions = [] } = usePromotionsFetcher();

  const [promoCode, setPromoCode] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [foundPromo, setFoundPromo] = useState<PromotionByType | null>(null);
  const [promoAmount, setPromoAmount] = useState<number | "">("");

  const sortedUsages = [...(order.promotion_usages ?? [])].sort((a, b) => {
    const orderMap: Record<PromotionType, number> = {
      [PromotionType.PERCENTAGE_DISCOUNT]: 1,
      [PromotionType.FIXED_DISCOUNT]: 2,
      [PromotionType.GIFT_CARD]: 3,
    };
    return orderMap[a.promotion.type] - orderMap[b.promotion.type];
  });

  useEffect(() => {
    if (activeTab === "promotions-discounts") {
      setTimeout(() => {
        const input = document.getElementById("promo-code-input");
        input?.focus();
      }, 300);
    }
  }, [activeTab]);

  useEffect(() => {
    setPromoCode("");
    setFoundPromo(null);
    setIsSearching(false);
  }, [activeTab]);

  useEffect(() => {
    if (!promoCode.trim()) {
      setFoundPromo(null);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const performSearch = debounce((code: string) => {
      const match = promotions.find((p) => p.code.toLowerCase() === code.trim().toLowerCase());

      // Calculate default amount for gift cards
      if (match && PromotionGuards.isGiftCard(match)) {
        // Calculate current order total with all existing discounts/promotions applied
        const currentTotal = getOrderTotal({
          order: order,
          applyDiscounts: true,
        });

        // Clamp to available gift card amount
        const availableAmount = Math.max(
          (match.fixed_amount ?? 0) - match.usages.reduce((sum, u) => sum + u.amount, 0),
          0
        );

        const defaultAmount = Math.min(currentTotal, availableAmount);
        setPromoAmount(defaultAmount);
      } else {
        setPromoAmount("");
      }

      setFoundPromo(match ?? null);
      setIsSearching(false);
    }, 500);

    performSearch(promoCode);
    return () => performSearch.cancel();
  }, [promoCode, promotions, order]);

  const utils = trpc.useUtils();

  const reset = async () => {
    await utils.promotions.getAll.invalidate({});
    await utils.promotions.getAll.refetch({});
    setPromoCode("");
    setFoundPromo(null);
    setPromoAmount("");
  };

  const handleApplyClick = async () => {
    if (!foundPromo) return;

    if (foundPromo.type === PromotionType.GIFT_CARD) {
      const amount = Number(promoAmount) || 0;
      applyPromotionToOrder(foundPromo.code, amount);
    } else {
      applyPromotionToOrder(foundPromo.code);
    }

    await reset();
  };

  const handleRemoveClick = async (usageId: number) => {
    removePromotionFromOrder(usageId);
    await reset();
  };

  const liveOrder = useMemo(() => {
    if (!foundPromo) return order;

    const pendingUsage: PromotionUsageWithPromotion = {
      id: -1,
      promotion_id: foundPromo.id,
      order_id: order.id,
      amount: Number(promoAmount),
      created_at: new Date(),
      promotion: foundPromo,
    };

    return {
      ...order,
      promotion_usages: [...sortedUsages, pendingUsage],
    };
  }, [order, sortedUsages, foundPromo, promoAmount]);

  useFocusOnClick(["promo-code-input", "promo-amount-input"]);

  return (
    <WasabiAnimatedTab
      value="promotions-discounts"
      currentValue={activeTab}
      className="flex flex-col gap-4 mt-2"
    >
      <div className="grid w-full gap-2">
        <ButtonGroup className="w-full py-1">
          <ButtonGroupText asChild>
            <Label htmlFor="promo-code-input">Codice</Label>
          </ButtonGroupText>

          <InputGroup>
            <InputGroupInput
              id="promo-code-input"
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleApplyClick();
              }}
            />
            <InputGroupAddon align="inline-end">
              {isSearching ? (
                <Spinner />
              ) : promoCode.trim() ? (
                foundPromo ? (
                  <InputGroupText className="text-green-600 font-medium">
                    <CheckIcon weight="bold" />
                  </InputGroupText>
                ) : (
                  <InputGroupText className="text-red-600 font-medium">
                    <XIcon weight="bold" />
                  </InputGroupText>
                )
              ) : null}
            </InputGroupAddon>
          </InputGroup>

          {foundPromo && (
            <>
              <ButtonGroupText asChild>
                <Label htmlFor="promo-amount-input">Importo</Label>
              </ButtonGroupText>

              <InputGroup className="w-52">
                <InputGroupInput
                  id="promo-amount-input"
                  type="number"
                  value={(function () {
                    if (!foundPromo) return "";
                    if (PromotionGuards.isFixedDiscount(foundPromo)) return foundPromo.fixed_amount;
                    if (PromotionGuards.isGiftCard(foundPromo)) return promoAmount;
                    if (PromotionGuards.isPercentageDiscount(foundPromo))
                      return foundPromo.percentage_value;
                  })()}
                  min={0}
                  step={0.01}
                  max={
                    PromotionGuards.isGiftCard(foundPromo)
                      ? Math.max(
                          (foundPromo.fixed_amount ?? 0) -
                            foundPromo.usages.reduce((sum, u) => sum + u.amount, 0),
                          0
                        )
                      : undefined
                  }
                  onChange={(e) => {
                    const val = e.target.value;

                    // Allow clearing the input
                    if (val === "") {
                      setPromoAmount("");
                      return;
                    }

                    const rawValue = Number(val);

                    if (PromotionGuards.isGiftCard(foundPromo)) {
                      const remaining =
                        (foundPromo.fixed_amount ?? 0) -
                        foundPromo.usages.reduce((sum, u) => sum + u.amount, 0);

                      // Clamp value only if it's numeric
                      if (!isNaN(rawValue)) {
                        const safeValue = Math.min(Math.max(rawValue, 0), remaining);
                        setPromoAmount(safeValue);
                      }
                    } else {
                      setPromoAmount(rawValue);
                    }
                  }}
                  disabled={!foundPromo || foundPromo.type !== PromotionType.GIFT_CARD}
                />

                <InputGroupAddon align="inline-start">
                  <InputGroupText>
                    {PromotionGuards.isPercentageDiscount(foundPromo) ? "%" : "€"}
                  </InputGroupText>
                </InputGroupAddon>
              </InputGroup>
            </>
          )}

          <Button
            disabled={!promoCode.trim() && !foundPromo}
            className="text-red-600 hover:text-red-600"
            variant="outline"
            onClick={reset}
          >
            Cancella
          </Button>

          <Button
            onClick={handleApplyClick}
            disabled={
              !foundPromo ||
              isSearching ||
              order.promotion_usages.some((u) => u.promotion_id === foundPromo?.id)
            }
          >
            {foundPromo && order.promotion_usages.some((u) => u.promotion_id === foundPromo.id)
              ? "Già applicata"
              : "Applica"}
          </Button>
        </ButtonGroup>
      </div>

      {!isSearching && promoCode.trim() && (
        <Card className="p-1">
          <CardContent className="p-2 text-sm flex gap-2 items-center">
            {!isSearching && promoCode && foundPromo == null ? (
              <span className="text-red-600 font-semibold">
                Nessuna promozione trovata con il codice "{promoCode}"
              </span>
            ) : foundPromo ? (
              (() => {
                // ✅ Check if the promotion is already applied
                const alreadyUsed = order.promotion_usages.some(
                  (u) => u.promotion_id === foundPromo.id
                );

                if (alreadyUsed) {
                  return (
                    <span className="text-orange-600 font-semibold">
                      Promozione già usata per questo ordine
                    </span>
                  );
                }

                // ✅ Otherwise, render your existing badge + details
                return (
                  <>
                    <Badge className={cn(PROMOTION_TYPES_COLORS[foundPromo.type])}>
                      {PromotionGuards.isFixedDiscount(foundPromo)
                        ? "Sconto fisso"
                        : PromotionGuards.isPercentageDiscount(foundPromo)
                          ? "Sconto Percentuale"
                          : PromotionGuards.isGiftCard(foundPromo)
                            ? "Gift Card"
                            : null}
                    </Badge>

                    <ArrowRightIcon />

                    {PromotionGuards.isFixedDiscount(foundPromo) &&
                      (() => {
                        const discount = foundPromo.fixed_amount ?? 0;
                        const baseTotal = getOrderTotal({ order: order, applyDiscounts: false });
                        return (
                          <p>
                            Sconto di{" "}
                            <span className="font-mono font-semibold">{toEuro(discount)}</span>
                          </p>
                        );
                      })()}

                    {PromotionGuards.isPercentageDiscount(foundPromo) &&
                      (() => {
                        const total = foundPromo.max_usages ?? null;
                        const used = foundPromo.usages.length;
                        const remaining = total ? Math.max(total - used, 0) : null;
                        const afterApply = total ? Math.max(total - used - 1, 0) : null;

                        const percent = foundPromo.percentage_value ?? 0;
                        const baseTotal = getOrderTotal({ order: order, applyDiscounts: false });
                        const discountValue = (baseTotal * percent) / 100;

                        return (
                          <>
                            <p>
                              Sconto del{" "}
                              <span className="font-mono font-semibold">
                                {foundPromo.percentage_value}%
                              </span>{" "}
                              {total && (
                                <span className="text-muted-foreground text-xs">
                                  (da {remaining} a {afterApply} usi)
                                </span>
                              )}
                            </p>

                            <ArrowRightIcon />

                            <span className="font-mono font-semibold">
                              −{toEuro(discountValue)}
                            </span>
                          </>
                        );
                      })()}

                    {PromotionGuards.isGiftCard(foundPromo) &&
                      (() => {
                        const totalUsed = foundPromo.usages.reduce((sum, u) => sum + u.amount, 0);
                        const initial = foundPromo.fixed_amount ?? 0;
                        const remaining = initial - totalUsed;
                        const newRemaining = remaining - (Number(promoAmount) || 0);

                        return (
                          <p className="flex gap-2 items-center">
                            Saldo disponibile:{" "}
                            <span className="font-mono font-semibold">{toEuro(remaining)}</span>
                            {promoAmount !== "" && promoAmount > 0 && (
                              <>
                                <ArrowRightIcon />
                                Saldo dopo l'applicazione:{" "}
                                <span className="font-mono font-semibold">
                                  {toEuro(Math.max(newRemaining, 0))}
                                </span>
                              </>
                            )}
                          </p>
                        );
                      })()}
                  </>
                );
              })()
            ) : null}
          </CardContent>
        </Card>
      )}

      {/* applied promotions */}
      {sortedUsages.length !== 0 && (
        <>
          <Separator className="-mb-4" />

          <Accordion type="single" collapsible className="w-full">
            {sortedUsages.map((usage, idx) => (
              <div className="flex gap-2 items-center w-full" key={`${usage.promotion_id}-${idx}`}>
                <AccordionItem value={`promotion-${usage.promotion_id}`} className="w-full">
                  <AccordionTrigger className="py-2">
                    <div className="flex justify-between w-full items-center">
                      <Badge className={cn(PROMOTION_TYPES_COLORS[usage.promotion.type])}>
                        {PROMOTION_TYPES_LABELS[usage.promotion.type]} ({usage.promotion.code})
                      </Badge>
                      <span className="text-sm text-muted-foreground font-mono">
                        {formatPromotionSummary(usage)}
                      </span>
                    </div>
                  </AccordionTrigger>

                  <AccordionContent>
                    <QuickPromoPreview usage={usage} />
                  </AccordionContent>
                </AccordionItem>

                <Button
                  variant={"destructive"}
                  className="h-8 w-8"
                  onClick={() => handleRemoveClick(usage.id)}
                >
                  <TrashIcon size={18} />
                </Button>
              </div>
            ))}
          </Accordion>
        </>
      )}

      {order.promotion_usages.length == 0 && <Separator />}

      <DiscountsSummary liveOrder={liveOrder} />
    </WasabiAnimatedTab>
  );
}

function formatPromotionSummary(usage: PromotionUsageWithPromotion): string {
  const promo = usage.promotion;
  switch (promo.type) {
    case PromotionType.FIXED_DISCOUNT:
      return `−${toEuro(promo.fixed_amount ?? 0)}`;
    case PromotionType.GIFT_CARD:
      return `${toEuro(usage.amount ?? 0)} di ${toEuro(promo.fixed_amount ?? 0)}`;
    case PromotionType.PERCENTAGE_DISCOUNT:
      return `−${promo.percentage_value}%`;
    default:
      return "";
  }
}
