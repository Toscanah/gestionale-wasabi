import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ControllerRenderProps } from "react-hook-form";
import { Address } from "@prisma/client";
import { useCallback, useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import parseAddress from "@/app/(site)/util/functions/parseAddress";
import { debounce } from "lodash";

export default function CustomerAddresses({ field }: { field: ControllerRenderProps }) {
  const [currentAddresses, setCurrentAddresses] = useState<Address[]>([...field.value]);
  const debouncedOnChange = useCallback(
    debounce((updatedAddresses) => {
      field.onChange(updatedAddresses);
    }, 500),
    [field]
  );

  const updateField = (addressId: number, key: keyof Address, value: any) => {
    const newAddresses = currentAddresses.map((address) => {
      if (address.id === addressId) {
        if (key === "street") {
          const { street, civic } = parseAddress(value);
          return { ...address, street, civic };
        } else {
          return { ...address, [key]: value };
        }
      }
      return address;
    });

    setCurrentAddresses(newAddresses);
    debouncedOnChange(newAddresses);
  };

  return (
    <Accordion
      type="single"
      collapsible
      className="max-h-96 w-[40vw] overflow-y-auto overflow-x-hidden pr-6"
    >
      {currentAddresses.length > 0 ? (
        currentAddresses.map((address, index) => (
          <AccordionItem value={address.id.toString()} key={address.id.toString()}>
            <AccordionTrigger>{address.street + " " + address.civic}</AccordionTrigger>
            <AccordionContent className="space-y-8">
              <div className="space-y-2">
                <Label>Indirizzo</Label>
                <Input
                  defaultValue={address.street + " " + address.civic}
                  onChange={(e) => updateField(address.id, "street", e.target.value)}
                />
              </div>

              <div className="flex justify-between gap-4">
                <div className="space-y-2 w-full">
                  <Label>Piano</Label>
                  <Input
                    defaultValue={address.floor?.toString()}
                    onChange={(e) => updateField(address.id, "floor", e.target.value)}
                  />
                </div>

                <div className="space-y-2 w-full">
                  <Label>Campanello</Label>
                  <Input defaultValue={address.doorbell?.toString()} />
                </div>

                <div className="space-y-2 w-full">
                  <Label>Scala</Label>
                  <Input defaultValue={address.stair?.toString()} />
                </div>
              </div>

              <div className="space-y-2 w-full">
                <Label>Informazioni stradali</Label>
                <Textarea defaultValue={address.street_info?.toString()} />
              </div>
            </AccordionContent>
          </AccordionItem>
        ))
      ) : (
        <AccordionItem value={"-1"}>
          <AccordionTrigger>Nessun indirizzo!</AccordionTrigger>
          <AccordionContent>Questo cliente perora non possiede nessun indirizzo</AccordionContent>
        </AccordionItem>
      )}
    </Accordion>
  );
}
