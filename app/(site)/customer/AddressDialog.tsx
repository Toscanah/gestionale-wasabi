"use client";

import { useEffect, useState } from "react";
import Overview from "./Overview";
import { Address, Customer } from "@prisma/client";
import AddressForm from "./address/AddressForm";
import { CustomerWithAddresses } from "../types/CustomerWithAddresses";

import { AddressChoice, AddressChoiceType } from "./AddressChoice";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogHeader,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Plus } from "@phosphor-icons/react";
import { Separator } from "@/components/ui/separator";

export default function AddressDialog() {
  const [choice, setChoice] = useState<AddressChoiceType>(AddressChoice.NEW);
  const [phone, setPhone] = useState<string>("0123456789");
  const [address, setAddress] = useState<Address | undefined>(undefined);
  const [customer, setCustomer] = useState<CustomerWithAddresses | undefined>(
    undefined
  );

  useEffect(() => {
    fetch(
      `/api/customers?phone=${encodeURIComponent(phone)}&requestType=getSingle`,
      {
        method: "GET",
      }
    )
      .then((response) => response.json())
      .then((customer) => setCustomer(customer));
  }, [phone, address]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="">
          <Plus className="mr-2 h-4 w-4" /> Crea ordine
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[90vw] max-w-screen max-h-screen h-[90vh] flex gap-10 justify-between">
        <Overview
          address={address}
          setPhone={setPhone}
          phone={phone}
          customer={customer}
          setAddress={setAddress}
          setChoice={setChoice}
        />

        <Separator orientation="vertical" />

        <div className="w-[60%] p-4 h-full ">
          {customer && (
            <AddressForm
              choice={choice}
              address={address ?? undefined}
              setAddress={setAddress}
              customer={customer}
            />

            // <div className="h-full w-full flex justify-center items-center text-3xl">
            //   Seleziona un domicilio per modificarne i dati
            // </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
