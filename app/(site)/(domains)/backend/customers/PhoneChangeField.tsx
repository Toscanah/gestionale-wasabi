"use client";

import React, { useState, useEffect, useMemo } from "react";
import debounce from "lodash/debounce";
import { ControllerRenderProps } from "react-hook-form";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { ButtonGroup } from "@/components/ui/button-group";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Loader2, CheckCircle2, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { trpc } from "@/lib/server/client";
import { Separator } from "@/components/ui/separator";

export default function PhoneChangeField({ field }: { field: ControllerRenderProps }) {
  const initialValue = useMemo(() => field.value, []);
  const [debouncedValue, setDebouncedValue] = useState(field.value);

  // 1. Logic to check if the input currently matches what we last searched
  const isOriginalValue = field.value === initialValue;
  const isSyncing = field.value !== debouncedValue;

  const debouncedSet = useMemo(
    () =>
      debounce((val: typeof field.value) => {
        setDebouncedValue(val);
      }, 700), // Reduced slightly for better UX
    []
  );

  useEffect(() => {
    debouncedSet(field.value);
    return () => debouncedSet.cancel();
  }, [field.value, debouncedSet]);

  const { data: customer, isFetching } = trpc.customers.getByPhone.useQuery(
    { phone: debouncedValue },
    {
      enabled: !!debouncedValue && debouncedValue !== initialValue,
      placeholderData: (prev) => prev,
    }
  );

  const showSpinner = (isFetching || isSyncing) && !isOriginalValue;

  const exists = !isSyncing && !isFetching && !!customer && debouncedValue !== initialValue;

  const available = !isSyncing && !isFetching && !customer && !isOriginalValue;

  return (
    <div className="space-y-2">
      <ButtonGroup className="w-full">
        <InputGroup
          className={cn(
            "flex-1 transition-colors",
            exists && "border-destructive ring-destructive"
          )}
        >
          <InputGroupInput {...field} id="phone-input" />

          <InputGroupAddon align="inline-end">
            <HoverCard openDelay={100} closeDelay={100}>
              <HoverCardTrigger asChild>
                <InputGroupText className="cursor-help justify-center">
                  {showSpinner ? (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  ) : exists ? (
                    <AlertCircle className="h-4 w-4 text-destructive" />
                  ) : available ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ) : (
                    <Info className="h-4 w-4 text-muted-foreground/30" />
                  )}
                </InputGroupText>
              </HoverCardTrigger>

              <HoverCardContent align="end" className="w-80">
                <div className="space-y-2">
                  <h4 className="text-base font-semibold">Stato Numero</h4>

                  <Separator />

                  {isOriginalValue && (
                    <p className="text-sm text-muted-foreground">
                      Questo è il numero attualmente salvato per questo cliente.
                    </p>
                  )}

                  {showSpinner && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Verifica in corso...
                    </div>
                  )}

                  {exists && (
                    <div className="space-y-2">
                      <p className="text-sm text-destructive font-semibold">
                        Attenzione: numero già occupato.
                      </p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {customer?.name ? (
                          <>
                            Questo numero appartiene già a <strong>{customer.name}</strong>.
                          </>
                        ) : (
                          "Questo numero è già associato a un cliente registrato."
                        )}{" "}
                        Se confermi, l'ordine più recente verrà importato nel suo profilo, mentre i
                        restanti dati del cliente attuale saranno rimossi definitivamente.
                      </p>
                    </div>
                  )}

                  {available && (
                    <p className="text-sm text-green-600">
                      Il numero è valido e può essere assegnato.
                    </p>
                  )}

                  {!isOriginalValue && !showSpinner && !exists && !available && (
                    <p className="text-sm text-muted-foreground">
                      Inserisci almeno 5 cifre per verificare...
                    </p>
                  )}
                </div>
              </HoverCardContent>
            </HoverCard>
          </InputGroupAddon>
        </InputGroup>
      </ButtonGroup>
    </div>
  );
}
