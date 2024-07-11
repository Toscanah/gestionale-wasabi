import { Separator } from "@/components/ui/separator";
import Overview from "../address/Overview";
import AddressForm from "../address/AddressForm";
import { useCallback, useEffect, useState } from "react";
import { AddressChoice } from "../address/AddressChoice";
import { Address } from "@prisma/client";
import { CustomerWithAddresses } from "../../types/CustomerWithAddresses";
import { debounce } from "lodash";

export default function ToHome() {
  const [choice, setChoice] = useState<AddressChoice>();
  const [address, setAddress] = useState<Address | undefined>(undefined);
  const [phone, setPhone] = useState<string>("");
  const [customer, setCustomer] = useState<CustomerWithAddresses | undefined>(
    undefined
  );

  const fetchCustomer = () => {
    fetch(
      `/api/customers?phone=${encodeURIComponent(phone)}&requestType=getSingle`,
      {
        method: "GET",
      }
    )
      .then((response) => response.json())
      .then((customer) => {
        setCustomer(customer ? customer : undefined);
      });
  };

  useEffect(() => {
    if (phone) {
      fetchCustomer();
    }
  }, [phone]);

  return (
    <div className="w-full flex gap-6 h-full">
      <Overview
        address={address}
        setPhone={setPhone}
        phone={phone}
        customer={customer}
        setAddress={setAddress}
        setChoice={setChoice}
      />

      <Separator orientation="vertical" />

      <div className="w-[60%] h-full ">
        {phone.length > 0 && (
          <AddressForm
            phone={phone}
            choice={choice}
            address={address ?? undefined}
            setAddress={setAddress}
            customer={customer}
            setCustomer={setCustomer}
          />
        )}
      </div>
    </div>
  );
}
