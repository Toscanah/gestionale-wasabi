import { Address, Customer } from "@prisma/client";
import { Dispatch, SetStateAction, useEffect, useState, useCallback } from "react";

import fetchRequest from "../functions/api/fetchRequest";
import { CustomerWithDetails } from "@/app/(site)/models";
import { debounce } from "lodash";

export default function useFetchCustomer(
  setSelectedAddress: Dispatch<SetStateAction<Address | undefined>>,
  initialPhone?: string,
  initialDoorbell?: string
) {
  const [phone, setPhone] = useState<string>(initialPhone ?? "");
  const [doorbellSearch, setDoorbellSearch] = useState<string>(initialDoorbell ?? "");
  const [possibleCustomers, setPossibleCustomers] = useState<CustomerWithDetails[]>([]);
  const [customer, setCustomer] = useState<Customer | undefined>(undefined);
  const [addresses, setAddresses] = useState<Address[]>([]);

  const resetState = () => {
    setAddresses([]);
    setSelectedAddress(undefined);
    setCustomer(undefined);
    setPossibleCustomers([]);
  };

  const fetchCustomer = useCallback(
    debounce((phone: string) => {
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
    }, 0),
    []
  );

  const fetchAddresses = (customerId: number) =>
    fetchRequest<Address[]>("GET", "/api/addresses/", "getAddressesByCustomer", {
      customerId: Number(customerId),
    }).then((fetchedAddresses) =>
      setAddresses(fetchedAddresses.filter((address) => !address.temporary))
    );

  const fetchCustomersByDoorbell = useCallback(
    debounce((doorbell: string) => {
      fetchRequest<CustomerWithDetails[]>("GET", "/api/customers", "getCustomersByDoorbell", {
        doorbell,
      }).then(setPossibleCustomers);
    }, 0),
    [] // Dependencies of debounce should remain empty to avoid recreation
  );

  useEffect(() => {
    if (phone) {
      resetState();
      setDoorbellSearch("");
      fetchCustomer(phone);
    }
  }, [phone, fetchCustomer]);

  useEffect(() => {
    if (doorbellSearch) {
      resetState();
      setPhone("");
      fetchCustomersByDoorbell(doorbellSearch);
    }
  }, [doorbellSearch, fetchCustomersByDoorbell]);

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
    setPossibleCustomers
  };
}
