"use client";

import { useEffect, useState } from "react";
import Overview from "./Overview";
import { Address, Customer } from "@prisma/client";
import AddressForm from "./address/AddressForm";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CustomerWithAddresses } from "../types/CustomerWithAddresses";
import { useSearchParams } from "next/navigation";

export default function CustomerPage() {
  const searchParams = useSearchParams();
  const [phone, setPhone] = useState<string>("");

  const [addressChoice, setAddressChoice] = useState<string>("");

  useEffect(() => {
    setPhone(
      searchParams.get("phone") ?? "Errore, numero di telefono non trovato"
    );
  }, [searchParams]);

  useEffect(() => {
    fetch(
      `/api/customers?phone=${encodeURIComponent(phone)}&requestType=getSingle`,
      {
        method: "GET",
      }
    )
      .then((response) => response.json())
      .then((customer) => setCustomer(customer));
  }, [phone]);

  const [address, setAddress] = useState<Address | undefined>(undefined);
  const [customer, setCustomer] = useState<CustomerWithAddresses | undefined>(
    undefined
  );

  return (
    <div className="flex h-screen w-screen justify-between gap-10 items-center">
      <Overview
        setPhone={setPhone}
        phone={phone}
        customer={customer}
        setAddress={setAddress}
        setAddressChoice={setAddressChoice}
      />

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
  );
}
