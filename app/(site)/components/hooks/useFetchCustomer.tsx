import { Address, Customer } from "@prisma/client";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import fetchRequest from "../../util/functions/fetchRequest";
import { CustomerWithDetails } from "@/app/(site)/models";

export default function useFetchCustomer(
  setSelectedAddress: Dispatch<SetStateAction<Address | undefined>>
) {
  const [phone, setPhone] = useState<string>("");
  const [doorbellSearch, setDoorbellSearch] = useState<string>("");
  const [possibleCustomers, setPossibleCustomers] = useState<CustomerWithDetails[]>([]);
  const [customer, setCustomer] = useState<Customer | undefined>(undefined);
  const [addresses, setAddresses] = useState<Address[]>([]);

  const resetState = () => {
    setAddresses([]);
    setSelectedAddress(undefined);
    setCustomer(undefined);
    setPossibleCustomers([]);
  };

  const fetchCustomer = () =>
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
      customerId,
    }).then((fetchedAddresses) =>
      setAddresses(fetchedAddresses.filter((address) => !address.temporary))
    );

  const fetchCustomersByDoorbell = () =>
    fetchRequest<CustomerWithDetails[]>("GET", "/api/customers", "getCustomersByDoorbell", {
      doorbell: doorbellSearch,
    }).then((customers) => setPossibleCustomers(customers));

  useEffect(() => {
    if (phone) {
      resetState();
      setDoorbellSearch("");
      fetchCustomer();
    }
  }, [phone]);

  useEffect(() => {
    if (doorbellSearch) {
      resetState();
      setPhone("");
      fetchCustomersByDoorbell();
    }
  }, [doorbellSearch]);

  return {
    customer,
    addresses,
    phone,
    doorbellSearch,
    possibleCustomers,
    setCustomer,
    setAddresses,
    setPhone,
    setDoorbellSearch,
  };
}
