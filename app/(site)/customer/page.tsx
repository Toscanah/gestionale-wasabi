"use client";

import { useEffect, useState } from "react";
import Overview from "./Overview";
import { Address, Customer } from "@prisma/client";
import AddressForm from "./address/AddressForm";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CustomerWithAddresses } from "../types/CustomerWithAddresses";

export default function CustomerPage({
  _customerChoice = "order",
}: {
  _customerChoice: string;
}) {
  const [phone, setPhone] = useState<string>("");
  const [customerChoice, setCustomerChoice] = useState<string>(_customerChoice);
  const [address, setAddress] = useState<Address | undefined>(undefined);
  const [customer, setCustomer] = useState<CustomerWithAddresses | undefined>(
    undefined
  );
  const [addressChoice, setAddressChoice] = useState<string>("");

  const handlePhoneAdd = (phone: string) => {
    setAddress(undefined);
    setCustomer(undefined);
    setAddressChoice("");
    setPhone(phone);
    fetch(
      `/api/customers?phone=${encodeURIComponent(phone)}&requestType=getSingle`
    )
      .then((response) => response.json())
      .then((customer) => setCustomer(customer));
  };

  useEffect(() => console.log(address), [address]);

  return (
    <div className="w-screen h-screen p-4 flex gap-4 flex-col">
      <RadioGroup
        defaultValue={customerChoice}
        onValueChange={(e) => {
          setCustomerChoice(e);
        }}
        className="flex w-full h-[20%] flex-row justify-around"
      >
        <div className="flex items-center space-x-3">
          <RadioGroupItem
            value="order"
            id="order"
            className="w-[60px] h-[60px]"
          />
          <Label htmlFor="order" className="text-4xl">
            Consegna
          </Label>
        </div>
        <div className="flex items-center space-x-3">
          <RadioGroupItem
            value="table"
            id="table"
            className="w-[60px] h-[60px]"
          />
          <Label htmlFor="table" className="text-4xl">
            Tavolo
          </Label>
        </div>
      </RadioGroup>

      {customerChoice == "order" ? (
        <div className="flex h-[80%] w-full justify-between items-center">
          <div className="w-[30%] p-4 h-full flex flex-col justify-end">
            <Overview
              phone={phone}
              handlePhoneAdd={handlePhoneAdd}
              customer={customer}
              setAddress={setAddress}
              setAddressChoice={setAddressChoice}
            />
          </div>
          <div className="w-[70%] p-4 h-full">
            {addressChoice !== "" && customer && (
              <AddressForm
                address={address ?? undefined}
                customer={customer}
                addressChoice={addressChoice}
                setAddress={setAddress}
              />
            )}
          </div>
        </div>
      ) : (
        <div className="h-[80%]">TODO:</div>
      )}
    </div>
  );
}
