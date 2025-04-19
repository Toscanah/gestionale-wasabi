import { Address, Customer } from "@prisma/client";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import fetchRequest from "../../lib/api/fetchRequest";
import { CustomerWithDetails } from "@shared"
;
import { useCreateHomeOrder } from "../../context/CreateHomeOrderContext";

interface UseCustomerLookupParams {
  initialPhone: string;
  initialDoorbell: string;
  resetState: () => void;
}

export default function useCustomerLookup({
  initialPhone,
  initialDoorbell,
  resetState,
}: UseCustomerLookupParams) {
  const [phone, setPhone] = useState<string>(initialPhone || "");
  const [doorbell, setDoorbell] = useState<string>(initialDoorbell || "");
  const [possibleCustomers, setPossibleCustomers] = useState<CustomerWithDetails[]>([]);
  const [customer, setCustomer] = useState<Customer | undefined>(undefined);
  const [addresses, setAddresses] = useState<Address[]>([]);

  const fetchCustomer = (phone: string) =>
    fetchRequest<Customer>("GET", "/api/customers", "getCustomerByPhone", {
      phone,
    }).then((fetchedCustomer) => {
      setCustomer(fetchedCustomer || undefined);

      if (fetchedCustomer) {
        fetchAddresses(fetchedCustomer.id);
      } else {
        setAddresses([]);
      }
    });

  const fetchAddresses = (customerId: number) =>
    fetchRequest<Address[]>("GET", "/api/addresses/", "getAddressesByCustomer", {
      customerId: Number(customerId),
    }).then((fetchedAddresses) =>
      setAddresses(fetchedAddresses.filter((address) => !address.temporary))
    );

  const fetchCustomersByDoorbell = (doorbell: string) =>
    fetchRequest<CustomerWithDetails[]>("GET", "/api/customers", "getCustomersByDoorbell", {
      doorbell,
    }).then(setPossibleCustomers);

  useEffect(() => {
    if (phone) {
      resetState();
      setDoorbell("");
      fetchCustomer(phone);
    }
  }, [phone]);

  useEffect(() => {
    if (doorbell) {
      resetState();
      setPhone("");
      fetchCustomersByDoorbell(doorbell);
    }
  }, [doorbell]);

  return {
    customer,
    addresses,
    phone,
    doorbell,
    possibleCustomers,
    setCustomer,
    setAddresses,
    setPhone,
    setDoorbell,
    setPossibleCustomers,
  };
}
