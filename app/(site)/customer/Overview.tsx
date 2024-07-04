import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Address, Customer } from "@prisma/client";
import {
  Dispatch,
  SetStateAction,
  useState,
  useCallback,
  KeyboardEvent,
} from "react";
import { CustomerWithAddresses } from "../types/CustomerWithAddresses";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { useEffect } from "react";
import { AddressChoice, AddressChoiceType } from "./AddressChoice";

interface OverviewProps {
  customer: CustomerWithAddresses | undefined;
  address: Address | undefined;
  phone: string;
  setAddress: Dispatch<SetStateAction<Address | undefined>>;
  setPhone: Dispatch<SetStateAction<string>>;
  setChoice: Dispatch<SetStateAction<AddressChoiceType>>;
}

export default function Overview({
  customer,
  setChoice,
  address,
  phone,
  setAddress,
  setPhone,
}: OverviewProps) {
  const [highlight, setHighlight] = useState<string>("");
  const [permAddresses, setPermAddresses] = useState<Address[]>([]);

  useEffect(() => {
    if (customer) {
      setPermAddresses(
        customer.addresses.filter((address) => !address.temporary)
      );
    }
  }, []);

  useEffect(() => {
    // si potrebbe fare che prende il domicilio utilizzato nell'ultimo ordine
    // anzi probabilmente 100% Lin chiede una cosa così
    if (permAddresses.length > 0) {
      setHighlight(permAddresses[0].id.toString());
      setAddress(permAddresses[0]);
    }
  }, [permAddresses]);

  return (
    <div
      className={cn(
        "h-full flex flex-col w-[40%] p-4 max-w-[40%]  min-w-[40%]",
        phone === "" || !customer ? "justify-center" : "justify-between"
      )}
    >
      <div className="flex w-full justify-center flex-col space-y-4">
        <Label htmlFor="phone" className="text-xl">
          Numero tel. cliente
        </Label>

        <Input
          id="phone"
          className="w-full text-center text-6xl h-16"
          defaultValue={phone}
          autoFocus
          onKeyDown={(e: any) => {
            if (e.key == "Enter") {
              setPhone(e.target.value);
            }
          }}
        />
      </div>

      {/**questo non può funzionare se ci sono 0 domicili all'inizio ??? */}
      {customer && permAddresses.length > 0 && (
        <RadioGroup
          className="flex flex-col gap-2 w-full max-h-[25rem] overflow-y-auto p-2"
          defaultValue={permAddresses[0].id.toString()}
        >
          <span className="text-xl font-medium">Domicili:</span>

          <Separator className="my-4" />

          {permAddresses.map((address, index) => (
            <div
              key={index}
              className={cn(
                "flex items-center w-full p-3 rounded gap-4 justify-between",
                highlight === address.id.toString()
                  ? "bg-muted-foreground/15"
                  : "bg-none"
              )}
            >
              <span>{`${index + 1} domicilio:`}</span>

              {/** */}

              <Button className="max-w-[70%] w-[70%]" variant={"outline"}>
                <span className="truncate">
                  {address.street} {address.civic}
                </span>
              </Button>

              <RadioGroupItem
                value={address.id.toString()}
                onClick={() => {
                  setHighlight(address.id.toString());
                  setAddress(address);
                  setChoice(AddressChoice.NORMAL);
                }}
                id={index.toString()}
              />
            </div>
          ))}

          <div
            className={cn(
              "flex items-center w-full p-3 rounded gap-4 justify-between",
              highlight === "new" ? "bg-muted-foreground/15" : "bg-none"
            )}
          >
            <span>{`${permAddresses.length + 1} domicilio:`}</span>

            <Button
              onClick={() => {
                setChoice(AddressChoice.NEW);
              }}
              className="max-w-[70%] w-[70%]"
            >
              <span className="truncate">Crea un nuovo domicilio</span>
            </Button>

            <div className="w-4 h-4"></div>
          </div>

          <div
            className={cn(
              "flex items-center w-full p-3 rounded gap-4 justify-between",
              highlight === "temp" ? "bg-muted-foreground/15" : "bg-none"
            )}
          >
            <span>Provvisorio:</span>
            <Button className="max-w-[70%] w-[70%]">
              {address && address.temporary
                ? `${address.street} ${address.civic}`
                : "Crea domicilio provvisorio"}
            </Button>

            <RadioGroupItem
              value="temp"
              id="temp"
              onClick={() => {
                setHighlight("temp");
                setAddress(undefined);
                setChoice(AddressChoice.TEMPORARY);
              }}
            />
          </div>
        </RadioGroup>
      )}

      {phone !== "" && customer && (
        <div className="w-full space-y-2">
          <Button className="text-4xl h-16 w-full" disabled={!address}>
            CONFERMA
          </Button>
        </div>
      )}
    </div>
  );
}
