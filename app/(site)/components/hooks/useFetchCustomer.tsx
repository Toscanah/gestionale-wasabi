import { Address, Customer } from "@prisma/client";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import fetchRequest from "../../util/functions/fetchRequest";

export default function useFetchCustomer(
  setSelectedAddress: Dispatch<SetStateAction<Address | undefined>>
) {
  const [phone, setPhone] = useState<string>("");
  const [customer, setCustomer] = useState<Customer | undefined>(undefined);
  const [addresses, setAddresses] = useState<Address[]>([]);

  const fetchCustomer = () => {
    fetchRequest<Customer>("GET", "/api/customers", "getCustomerByPhone", {
      phone,
    }).then((fetchedCustomer) => {
      setCustomer(fetchedCustomer || undefined);

      if (fetchedCustomer) {
        fetchAddresses(fetchedCustomer.id);
      } else {
        setAddresses([])
      }
    });
  };

  const fetchAddresses = (customerId: number) => {
    fetchRequest<Address[]>("GET", "/api/addresses/", "getAddressesByCustomer", {
      customerId,
    }).then((fetchedAddresses) =>
      setAddresses(fetchedAddresses.filter((address) => !address.temporary))
    );
  };

  useEffect(() => {
    if (phone) {
      setAddresses([])
      setSelectedAddress(undefined);
      setCustomer(undefined);
      fetchCustomer();
    }
  }, [phone]);

  return {
    customer,
    addresses,
    phone,
    setCustomer,
    setAddresses,
    setPhone,
  };
}
