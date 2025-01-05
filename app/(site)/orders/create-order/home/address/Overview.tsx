import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Address } from "@prisma/client";
import { Dispatch, KeyboardEvent, RefObject, SetStateAction, useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { useEffect } from "react";
import fetchRequest from "@/app/(site)/functions/api/fetchRequest";
import { HomeOrder } from "@/app/(site)/models";
import { Badge } from "@/components/ui/badge";

interface OverviewProps {
  selectedAddress: Address | undefined;
  setSelectedAddress: Dispatch<SetStateAction<Address | undefined>>;
  addresses: Address[];
  setPhone: Dispatch<SetStateAction<string>>;
  phone: string;
  selectedOption: string;
  doorbellSearch: string;
  setDoorbellSearch: Dispatch<SetStateAction<string>>;
  setSelectedOption: Dispatch<SetStateAction<string>>;
  formRef: any;
  phoneRef: RefObject<any>;
  doorbellSearchRef: RefObject<any>;
  handleKeyDown: (e: KeyboardEvent) => void;
  createHomeOrder: () => void;
  createOrderRef: RefObject<HTMLButtonElement>;
}

export default function Overview({
  selectedAddress,
  setSelectedAddress,
  addresses,
  setPhone,
  createOrderRef,
  phone,
  selectedOption,
  setSelectedOption,
  formRef,
  phoneRef,
  doorbellSearchRef,
  handleKeyDown,
  createHomeOrder,
  setDoorbellSearch,
  doorbellSearch,
}: OverviewProps) {
  const [permAddresses, setPermAddresses] = useState<Address[]>([]);
  const [tempAddress, setTempAddress] = useState<Address | undefined>();
  const [lastAddressId, setLastAddressId] = useState<string>("");
  const [orderDisabled, setOrderDisabled] = useState<boolean>(true);

  useEffect(() => {
    setOrderDisabled(
      (selectedOption == "new" && selectedAddress == undefined) ||
        (selectedOption == "temp" && selectedAddress == undefined)
    );
  }, [selectedOption, selectedAddress]);

  useEffect(() => {
    if (!orderDisabled) {
      createOrderRef.current?.focus();
    }
  }, [orderDisabled]);

  useEffect(() => {
    setLastAddressId("");
    setPermAddresses(addresses.filter((address) => !address.temporary));
    setTempAddress(addresses.find((address) => address.temporary));
  }, [addresses]);

  useEffect(() => {
    if (phone) {
      fetchRequest<HomeOrder>("GET", "/api/addresses/", "getLastAddressOfCustomer", { phone }).then(
        (lastAddress) => {
          if (lastAddress?.home_order) {
            const address = addresses.some(
              (addr) => addr.id === lastAddress.home_order?.address_id && addr.active
            )
              ? lastAddress.home_order.address_id.toString()
              : "";
            setLastAddressId(address);
            setSelectedOption(address);
          }
        }
      );
    }
  }, [permAddresses]);

  useEffect(() => {
    if (selectedAddress) {
      setSelectedOption(selectedAddress.temporary ? "temp" : selectedAddress.id.toString());
    } else {
      setSelectedOption(
        lastAddressId || permAddresses.find((addr) => addr.active)?.id.toString() || "new"
      );
    }
  }, [permAddresses]);

  useEffect(() => {
    const address =
      selectedOption === "temp"
        ? tempAddress
        : selectedOption === "new"
        ? undefined
        : addresses.find((addr) => selectedOption === addr.id.toString());

    setSelectedAddress(address);
  }, [selectedOption]);

  return (
    <div className="h-full flex flex-col w-[30%] max-w-[30%]  min-w-[30%] justify-between">
      <div className="flex w-full justify-center flex-col space-y-4">
        <Label htmlFor="phone" className="text-xl">
          Numero tel. cliente
        </Label>

        <Input
          id="phone"
          ref={phoneRef}
          className="w-full text-center text-3xl h-16"
          defaultValue={phone}
          type="number"
          onKeyDown={handleKeyDown}
          onChange={(e: any) => setPhone(e.target.value)}
        />

        <Label htmlFor="customer-name" className="text-xl">
          Campanello del cliente
        </Label>

        <Input
          id="customer-name"
          ref={doorbellSearchRef}
          className="w-full text-center text-3xl h-16"
          defaultValue={doorbellSearch}
          type="text"
          onKeyDown={handleKeyDown}
          onChange={(e: any) => setDoorbellSearch(e.target.value)}
        />
      </div>

      {phone !== "" && (
        <RadioGroup
          className="flex flex-col gap-2 w-full max-h-[25rem] overflow-y-auto p-2"
          defaultValue={selectedOption}
          value={selectedOption}
          onValueChange={(value) => setSelectedOption(value)}
        >
          <span className="text-xl font-medium">Domicili:</span>

          <Separator className="my-4" />

          {permAddresses.map((address, index) => (
            <div
              key={index}
              className={cn(
                "flex items-center w-full p-3 rounded gap-4 justify-between",
                selectedOption === address.id.toString() ? "bg-muted-foreground/15" : "bg-none",
                !address.active && "*:text-muted-foreground hover:cursor-not-allowed"
              )}
            >
              <span>{`${index + 1} domicilio:`}</span>

              <Button
                className={cn("max-w-[70%] w-[70%]", !address.active && "border-red-600")}
                variant={"outline"}
                disabled={!address.active}
                onClick={() => setSelectedOption(address.id.toString())}
              >
                <span className="truncate flex gap-2 items-center">
                  {!address.active && <Badge variant={"destructive"}>Non attivo</Badge>}
                  {address.street.charAt(0).toUpperCase() + address.street.substring(1)}{" "}
                  {address.civic}
                </span>
              </Button>

              <RadioGroupItem value={address.id.toString()} disabled={!address.active} />
            </div>
          ))}

          <div
            className={cn(
              "flex items-center w-full p-3 rounded gap-4 justify-between",
              selectedOption === "new" ? "bg-muted-foreground/15" : "bg-none"
            )}
          >
            <span>{`${permAddresses.length + 1} domicilio:`}</span>

            <Button onClick={() => setSelectedOption("new")} className="max-w-[70%] w-[70%]">
              <span className="truncate">Crea un nuovo domicilio</span>
            </Button>

            <div className="w-4 h-4"></div>
          </div>

          <div
            className={cn(
              "flex items-center w-full p-3 rounded gap-4 justify-between",
              selectedOption === "temp" ? "bg-muted-foreground/15" : "bg-none"
            )}
          >
            <span>Provvisorio:</span>
            <Button className="max-w-[70%] w-[70%]" onClick={() => setSelectedOption("temp")}>
              {tempAddress
                ? `${tempAddress.street} ${tempAddress.civic}`
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
            disabled={
              selectedAddress == undefined && selectedOption !== "new" && selectedOption !== "temp"
            }
            onClick={() =>
              formRef.current.dispatchEvent(
                new Event("submit", { cancelable: true, bubbles: true })
              )
            }
          >
            SALVA DATI
          </Button>

          <Button
            className="text-4xl h-16 w-full"
            autoFocus
            ref={createOrderRef}
            disabled={orderDisabled}
            onClick={createHomeOrder}
          >
            CREA ORDINE
          </Button>
        </div>
      )}
    </div>
  );
}
