import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Address, Customer } from "@prisma/client";
import { Dispatch, SetStateAction, useState } from "react";
import { CustomerWithAddresses } from "../types/CustomerWithAddresses";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export default function Overview({
  setPhone,
  phone,
  customer,
  setAddress,
  setAddressChoice,
}: {
  setPhone: Dispatch<SetStateAction<string>>;
  phone: string;
  customer: CustomerWithAddresses | undefined;
  setAddress: Dispatch<SetStateAction<Address | undefined>>;
  setAddressChoice: Dispatch<SetStateAction<string>>;
}) {
  const [higlight, setHighlight] = useState<string>("");

  return (
    <div className="h-full flex flex-col justify-evenly w-[30%] p-4">
      <div className="flex w-full items-center justify-center">
        <Input
        className="w-full text-center text-6xl h-16"
          defaultValue={phone}
          onKeyDown={(e: any) => {
            if ((e.key = "Enter")) {
              setPhone(e.target.value);
            }
          }}
        />
      </div>

      {customer && (
        <RadioGroup className="flex flex-col gap-2 w-full">
          {customer.addresses.map((address, index: number) => (
            <div
              key={index}
              className={cn(
                "flex items-center gap-4 w-ful p-2 rounded",
                higlight === address.id.toString() ? "bg-[#450a0a]" : "bg-none"
              )}
            >
              <Label
                htmlFor={index.toString()}
                className="flex items-center w-4/5 "
              >
                <span className="w-1/4">{index + 1 + " domicilio: "}</span>

                <Button
                  onClick={() => {
                    setAddressChoice("normal");
                    setAddress(address);
                  }}
                  className="w-3/4 max-w-72"
                >
                  <span className="truncate">
                    {address.street} {address.civic}
                  </span>
                </Button>
              </Label>
              <div className="w-1/5">
                <RadioGroupItem
                  value={address.id.toString()}
                  onClick={() => {
                    setHighlight(address.id.toString());
                    setAddress(address);
                    setAddressChoice("");
                  }}
                  id={index.toString()}
                  className="w-8 h-8"
                />
              </div>
            </div>
          ))}

          <div
            className={cn(
              "flex items-center gap-4 w-full p-2 rounded",
              higlight === "new" ? "bg-[#450a0a]" : "bg-none"
            )}
          >
            <Label htmlFor={"new"} className="flex items-center w-4/5 ">
              <span className="w-1/4">
                {customer.addresses.length + 1 + " domicilio: "}
              </span>

              <Button
                onClick={() => {
                  setAddress(undefined);
                  setAddressChoice("new");
                }}
                className="w-3/4 max-w-72"
              >
                <span className="truncate">Crea nuova domicilio</span>
              </Button>
            </Label>
            <div className="w-1/5"></div>
          </div>

          <div
            className={cn(
              "flex items-center gap-4 w-full p-2 rounded",
              higlight === "temp" ? "bg-[#450a0a]" : "bg-none"
            )}
          >
            <Label htmlFor="temp" className="flex items-center w-4/5 ">
              <div className="w-1/4">Provvisorio:</div>
              <Button
                variant="secondary"
                className="w-3/4 max-w-72"
                onClick={() => {
                  setAddress(undefined);
                  setAddressChoice("temp");
                }}
              >
                Crea domicilio provvisorio
              </Button>
            </Label>
            <div className="w-[20%]">
              <RadioGroupItem
                value="temp"
                id="temp"
                className="w-8 h-8"
                onClick={() => {
                  setHighlight("temp");
                  setAddressChoice("");
                }}
              />
            </div>
          </div>
        </RadioGroup>
      )}

      <div className="w-full">
        <Button className="text-4xl h-16 w-full">CONFERMA</Button>
      </div>
    </div>
  );
}
