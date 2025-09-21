import { useEffect, useState } from "react";
import { trpc } from "@/lib/server/client";
import { AddressType, CustomerType } from "@/prisma/generated/schemas";

interface UseCustomerLookupParams {
  initialPhone: string;
  initialDoorbell: string;
  onReset: () => void;
}

export default function useCustomerLookup({
  initialPhone,
  initialDoorbell,
  onReset,
}: UseCustomerLookupParams) {
  const [phone, setPhone] = useState<string>(initialPhone || "");
  const [doorbell, setDoorbell] = useState<string>(initialDoorbell || "");

  // ---- Queries
  const { data: customer = undefined } = trpc.customers.getByPhone.useQuery(
    { phone },
    { enabled: !!phone }
  );

  const { data: fetchedAddresses = [] } = trpc.addresses.getByCustomer.useQuery(
    { customerId: customer?.id ?? -1 },
    {
      enabled: !!customer?.id,
      select: (addresses) => addresses.filter((addr) => !addr.temporary),
    }
  );

  const { data: fetchedPossibleCustomers = [] } = trpc.customers.getByDoorbell.useQuery(
    { doorbell },
    { enabled: !!doorbell }
  );

  useEffect(() => {
    if (phone) {
      onReset();
      setDoorbell("");
    }
  }, [phone]);

  useEffect(() => {
    if (doorbell) {
      onReset();
      setPhone("");
    }
  }, [doorbell]);

  return {
    customer: customer || undefined,
    addresses: fetchedAddresses,
    phone,
    doorbell,
    possibleCustomers: fetchedPossibleCustomers ?? [],
    setPhone,
    setDoorbell,
  };
}
