"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import parseAddress from "@/app/(site)/lib/utils/domains/address/parseAddress";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { AddressType } from "@/prisma/generated/schemas";
import { ControllerRenderProps } from "react-hook-form";
import { Plus, Power, PowerOff } from "lucide-react";
import WasabiDialog from "@/app/(site)/components/ui/wasabi/WasabiDialog";

interface CustomerAddressesProps {
  field: ControllerRenderProps;
}

export default function CustomerAddresses({ field }: CustomerAddressesProps) {
  const addresses: AddressType[] = field.value ?? [];

  const updateForm = (newAddresses: AddressType[]) => {
    field.onChange(newAddresses);
  };

  const addAddress = () => {
    const newAddress: AddressType = {
      id: Math.min(0, ...addresses.map((a) => a.id)) - 1,
      street: "",
      civic: "",
      doorbell: "",
      floor: "",
      stair: "",
      street_info: "",
      active: true,
      temporary: false,
      customer_id: addresses[0]?.customer_id ?? 0,
    };
    updateForm([newAddress, ...addresses]);
  };

  const toggleAddress = (id: number) => {
    updateForm(addresses.map((a) => (a.id === id ? { ...a, active: !a.active } : a)));
  };

  const updateField = (addressId: number, key: keyof AddressType, value: any) => {
    const updated = addresses.map((address) => {
      if (address.id === addressId) {
        if (key === "street") {
          const { street, civic } = parseAddress(value);
          return { ...address, street, civic };
        }
        return { ...address, [key]: value };
      }
      return address;
    });
    updateForm(updated);
  };

  return (
    <WasabiDialog
      putSeparator
      putUpperBorder
      trigger={<Button variant={"outline"}>Aggiungi / Modifica Indirizzi</Button>}
      title="Indirizzi cliente"
    >
      <div className="space-y-4">
        {/* <div className="flex items-center justify-between">
          <Button type="button" size="sm" variant="outline" onClick={addAddress} className="gap-2">
            <Plus className="h-4 w-4" /> Aggiungi
          </Button>
        </div> */}

        <Accordion type="single" collapsible className="max-h-[500px] overflow-y-auto">
          {addresses.length > 0 ? (
            addresses.map((address, index) => (
              <div className="w-full flex gap-4 items-center" key={address.id}>
                <AccordionItem value={address.id.toString()} className="grow">
                  <AccordionTrigger className="hover:no-underline text-xl">
                    <div className="flex gap-4 items-center">
                      <Badge
                        className={cn(
                          address.active
                            ? "bg-green-400 text-green-950 dark:text-green-950"
                            : "bg-destructive"
                        )}
                      >
                        {address.active ? "Attivo" : "Disattivato"}
                      </Badge>
                      <span className={cn("text-sm")}>
                        {address.street ? `${address.street} ${address.civic}` : ""}
                      </span>
                    </div>
                  </AccordionTrigger>

                  <AccordionContent className="space-y-8 mx-2">
                    <div className="space-y-2">
                      <Label>Indirizzo</Label>
                      <Input
                        placeholder="Via Roma 10"
                        value={address.street + (address.civic ? " " + address.civic : "")}
                        onChange={(e) => updateField(address.id, "street", e.target.value)}
                      />
                    </div>

                    <div className="flex justify-between gap-4">
                      <div className="space-y-2 w-full">
                        <Label>Campanello</Label>
                        <Input
                          value={address.doorbell ?? ""}
                          onChange={(e) => updateField(address.id, "doorbell", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2 w-full">
                        <Label>Piano</Label>
                        <Input
                          value={address.floor ?? ""}
                          onChange={(e) => updateField(address.id, "floor", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2 w-full">
                        <Label>Scala</Label>
                        <Input
                          value={address.stair ?? ""}
                          onChange={(e) => updateField(address.id, "stair", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2 w-full">
                      <Label>Note / Info stradali</Label>
                      <Textarea
                        placeholder="Arrivare da... campanello non funziona..."
                        value={address.street_info ?? ""}
                        onChange={(e) => updateField(address.id, "street_info", e.target.value)}
                        className="resize-none"
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className={cn(
                    "flex items-center justify-center",
                    address.active ? "text-destructive" : "text-green-600"
                  )}
                  onClick={() => toggleAddress(address.id)}
                >
                  {address.active ? (
                    <>
                      <PowerOff className="h-4 w-4" />
                      {/* <span className="text-xs font-semibold uppercase">Disattiva</span> */}
                    </>
                  ) : (
                    <>
                      <Power className="h-4 w-4" />
                      {/* <span className="text-xs font-semibold uppercase">Attiva</span> */}
                    </>
                  )}
                </Button>
              </div>
            ))
          ) : (
            <div className="py-10 text-center text-muted-foreground text-sm italic">
              Nessun indirizzo associato. Clicca su aggiungi per iniziare.
            </div>
          )}
        </Accordion>
      </div>
    </WasabiDialog>
  );
}
