import { Separator } from "@/components/ui/separator";
import Overview from "./address/Overview";
import AddressForm from "./address/AddressForm";
import { useEffect, useState } from "react";
import { AddressChoice } from "./address/AddressChoice";
import { Address, Customer } from "@prisma/client";
import { CustomerWithAddresses } from "../../types/CustomerWithAddresses";

export default function ToHome() {
  const [selectedAddress, setSelectedAddress] = useState<Address | undefined>(
    undefined
  );
  const [customer, setCustomer] = useState<Customer | undefined>(undefined);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [phone, setPhone] = useState<string>("");
  const [addInfo, setAddInfo] = useState<{
    notes: string | undefined;
    when: string | undefined;
    contactPhone: string | undefined;
  }>({ notes: "", when: "", contactPhone: "" });

  const fetchAddresses = () => {
    if (customer) {
      fetch(
        `/api/addresses?customerId=${encodeURIComponent(
          customer.id
        )}&requestType=getAddressesByCustomer`,
        {
          method: "GET",
        }
      )
        .then((response) => response.json())
        .then((addresses: Address[]) => {
          if (addresses.length > 0) {
            setAddresses(addresses);
          } else {
            setAddresses([]);
          }
        });
    }
  };

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
        // clear old possible addresses from other phones
        if (!customer) {
          setAddresses([]);
        }
      });
  };

  useEffect(() => {
    if (phone) {
      fetchCustomer();
    }
  }, [phone]);

  useEffect(() => fetchAddresses(), [customer]);

  const createHomeOrder = () => {
    fetch("/api/orders/", {
      method: "POST",
      body: JSON.stringify({
        requestType: "createHomeOrder",
        content: {
          customer: customer,
          address: address,
          notes: notes,
          when: when,
          contact_phone: contactPhone,
        },
      }),
    })
      .then((response) => response.json())
      .then((order) => {});
  };

  return (
    <div className="w-full flex gap-6 h-full">
      <Overview
        selectedAddress={selectedAddress}
        setSelectedAddress={setSelectedAddress}
        addresses={addresses}
        setPhone={setPhone}
        phone={phone}
        createHomeOrder={createHomeOrder}
      />

      <Separator orientation="vertical" />

      <div className="w-[60%] h-full ">
        {phone.length > 0 && (
          <AddressForm
            setAddInfo={setAddInfo}
            customer={customer}
            selectedAddress={selectedAddress}
          />
        )}
      </div>
    </div>
  );
}
