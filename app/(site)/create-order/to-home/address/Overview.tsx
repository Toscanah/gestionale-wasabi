import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Address } from "@prisma/client";
import { Dispatch, SetStateAction, useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { useEffect } from "react";

interface OverviewProps {
  selectedAddress: Address | undefined;
  setSelectedAddress: Dispatch<SetStateAction<Address | undefined>>;
  addresses: Address[];

  setPhone: Dispatch<SetStateAction<string>>;
  phone: string;

  createHomeOrder: () => void;
}

export default function Overview({
  selectedAddress,
  setSelectedAddress,
  addresses,

  setPhone,
  phone,

  createHomeOrder,
}: OverviewProps) {
  const [permAddresses, setPermAddresses] = useState<Address[]>([]);
  const [highlight, setHighlight] = useState<string>("");

  useEffect(() => {
    setPermAddresses(
      addresses.length > 0
        ? addresses.filter((address) => !address.temporary)
        : []
    );
  }, [addresses]);

  useEffect(() => {
    setHighlight(permAddresses[0]?.id.toString() ?? "");
  }, [permAddresses]);

  useEffect(() => {
    switch (highlight) {
      case "temp":
        setSelectedAddress(undefined);
        break;
      case "new": {
        break;
      }
      default: {
        setSelectedAddress(
          permAddresses.find((address) => highlight == address.id.toString())
        );
        break;
      }
    }
  }, [highlight]);

  return (
    <div className="h-full flex flex-col w-[40%] max-w-[40%]  min-w-[40%] justify-between">
      <div className="flex w-full justify-center flex-col space-y-4">
        <Label htmlFor="phone" className="text-xl">
          Numero tel. cliente
        </Label>

        <Input
          id="phone"
          className="w-full text-center text-6xl h-16"
          defaultValue={phone}
          autoFocus
          type="number"
          onChange={(e: any) => {
            setPhone(e.target.value);
          }}
        />
      </div>

      {phone !== "" && (
        <RadioGroup
          className="flex flex-col gap-2 w-full max-h-[25rem] overflow-y-auto p-2"
          defaultValue={highlight}
          value={highlight}
          onValueChange={(value) =>
            //  setSelectedAddress(
            //    addresses.find((address) => address.id.toString() == value)
            //  )

            setHighlight(value)
          }
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

              <Button
                className="max-w-[70%] w-[70%]"
                variant={"outline"}
                onClick={() => {
                  setHighlight(address.id.toString());
                }}
              >
                <span className="truncate">
                  {address.street} {address.civic}
                </span>
              </Button>

              <RadioGroupItem value={address.id.toString()} />
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
                setHighlight("new");
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
            <Button
              className="max-w-[70%] w-[70%]"
              onClick={() => setHighlight("temp")}
            >
              {selectedAddress && selectedAddress.temporary
                ? `${selectedAddress.street} ${selectedAddress.civic}`
                : "Crea domicilio provvisorio"}
            </Button>

            <RadioGroupItem value="temp" />
          </div>
        </RadioGroup>
      )}

      {phone !== "" && (
        <div className="w-full space-y-2">
          <Button
            className="text-4xl h-16 w-full"
            disabled={!selectedAddress}
            onClick={() => {
              createHomeOrder();
            }}
          >
            CREA ORDINE
          </Button>
        </div>
      )}
    </div>
  );
}
