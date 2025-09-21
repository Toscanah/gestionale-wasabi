import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { KeyboardEvent, RefObject, useCallback, useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { useCreateHomeOrder } from "@/app/(site)/context/CreateHomeOrderContext";
import { debounce } from "lodash";

interface OverviewProps {
  phoneRef: RefObject<HTMLInputElement>;
  doorbellRef: RefObject<HTMLInputElement>;
  formRef: any;
  handleKeyDown: (e: KeyboardEvent) => void;
  createOrderRef: RefObject<HTMLButtonElement>;
}

export default function Overview({
  createOrderRef,
  phoneRef,
  formRef,
  handleKeyDown,
  doorbellRef,
}: OverviewProps) {
  const [orderDisabled, setOrderDisabled] = useState<boolean>(true);
  const {
    selectedOption,
    selectedAddress,
    setPhone,
    phone,
    createHomeOrder,
    setDoorbell,
    doorbell,
    permAddresses,
    setSelectedOption,
    tempAddress,
  } = useCreateHomeOrder();

  useEffect(
    () =>
      setOrderDisabled(
        (selectedOption == "new" && selectedAddress == undefined) ||
          (selectedOption == "temp" && selectedAddress == undefined)
      ),
    [selectedOption, selectedAddress]
  );

  useEffect(() => {
    if (!orderDisabled) {
      createOrderRef.current?.focus();
    }
  }, [orderDisabled]);

  const handlePhoneChange = useCallback(
    debounce((e: React.ChangeEvent<HTMLInputElement>) => {
      setPhone(e.target.value);
    }, 300),
    []
  );

  const handleDoorbellChange = useCallback(
    debounce((e: React.ChangeEvent<HTMLInputElement>) => {
      setDoorbell(e.target.value);
    }, 300),
    []
  );

  return (
    <div className="h-full flex flex-col w-[30%] max-w-[30%]  min-w-[30%] justify-between">
      <div className="flex w-full justify-center flex-col space-y-4">
        <Label htmlFor="phone" className="text-xl">
          Ricerca per numero tel. cliente
        </Label>

        <Input
          id="phone"
          ref={phoneRef}
          className="w-full text-center text-3xl h-16"
          defaultValue={phone}
          type="number"
          onKeyDown={handleKeyDown}
          onChange={handlePhoneChange}
        />

        <Label htmlFor="customer-name" className="text-xl">
          Ricerca per campanello
        </Label>

        <Input
          id="customer-name"
          ref={doorbellRef}
          className="w-full text-center text-3xl h-16"
          defaultValue={doorbell}
          type="text"
          disabled
          onKeyDown={handleKeyDown}
          onChange={handleDoorbellChange}
        />
      </div>

      {phone !== "" && (
        <RadioGroup
          className="flex flex-col gap-2 w-full max-h-[25rem] overflow-y-auto p-2"
          defaultValue={selectedOption}
          value={selectedOption}
          onValueChange={setSelectedOption}
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
                <span className="truncate flex gap-2 items-center font-bold uppercase">
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
