import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Address } from "@prisma/client";
import { useState, Dispatch, SetStateAction } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import parseAddress from "@/app/(site)/util/functions/parseAddress";
import { Button } from "@/components/ui/button";
import fetchRequest from "@/app/(site)/util/functions/fetchRequest";
import { CustomerWithDetails } from "@/app/(site)/types/CustomerWithDetails";
import { Trash } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export default function CustomerAddresses({
  addresses,
  customerId,
  setCustomers,
}: {
  addresses: Address[];
  customerId: number;
  setCustomers: Dispatch<SetStateAction<CustomerWithDetails[]>>;
}) {
  const [currentAddresses, setCurrentAddresses] = useState<Address[]>(addresses ?? []);

  const saveAddresses = () => {
    fetchRequest<CustomerWithDetails[]>("POST", "/api/customers", "updateAddressesOfCustomer", {
      addresses: currentAddresses,
      customerId,
    }).then((updatedCustomers) => {
      setCustomers(updatedCustomers);
    });
  };

  const addAddress = () => {
    setCurrentAddresses((prevAddresses) => [
      {
        civic: "",
        customer_id: customerId,
        doorbell: "",
        floor: "",
        stair: "",
        street: "",
        street_info: "",
        temporary: false,
        id: -1 * prevAddresses.length,
        active: true,
      },
      ...prevAddresses,
    ]);
  };

  const toggleAddress = (addressToToggle: Address) => {
    setCurrentAddresses((prevAddresses) =>
      prevAddresses.map((address) =>
        address.id === addressToToggle.id ? { ...address, active: !address.active } : address
      )
    );
  };

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
  };

  return (
    <div className="space-y-4">
      <Button className="w-full" onClick={() => addAddress()}>
        Aggiungi indirizzo
      </Button>

      <div className="text-muted-foreground text-sm">
        NB: Gli indirizzi non attivi non potranno venir utilizzati negli ordini
      </div>

      <Accordion
        type="single"
        collapsible
        className="max-h-[450px] w-[40vw] overflow-y-auto overflow-x-hidden pr-4"
      >
        {currentAddresses.length > 0 ? (
          currentAddresses.map((address, index) => (
            <div className="w-full flex gap-4 items-center">
              <AccordionItem value={address.id.toString()} key={address.id} className={cn("grow")}>
                <AccordionTrigger className="text-xl ">
                  <div className="flex gap-4 items-center">
                    {address.id < 0 ? (
                      `Nuovo indirizzo #${index + 1}`
                    ) : (
                      <>
                        <Badge variant={address.active ? "default" : "destructive"}>
                          {address.active ? "Attivo" : "Non attivo"}
                        </Badge>
                        {address.street + " " + address.civic}
                      </>
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-8 mx-2">
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
                      <Input
                        defaultValue={address.doorbell?.toString()}
                        onChange={(e) => updateField(address.id, "doorbell", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2 w-full">
                      <Label>Scala</Label>
                      <Input
                        defaultValue={address.stair?.toString()}
                        onChange={(e) => updateField(address.id, "stair", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2 w-full">
                    <Label>Informazioni stradali</Label>
                    <Textarea
                      defaultValue={address.street_info?.toString()}
                      onChange={(e) => updateField(address.id, "street_info", e.target.value)}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

              <Button type="button" variant="link" onClick={() => toggleAddress(address)}>
                {address.active ? "Disattiva" : "Attiva"}
              </Button>
            </div>
          ))
        ) : (
          <AccordionItem value={"no"}>
            <AccordionTrigger>Nessun indirizzo!</AccordionTrigger>
            <AccordionContent>
              Questo cliente per ora non possiede nessun indirizzo
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>

      <div className="flex justify-end">
        <Button onClick={() => saveAddresses()}>Salva modifiche</Button>
      </div>
    </div>
  );
}
