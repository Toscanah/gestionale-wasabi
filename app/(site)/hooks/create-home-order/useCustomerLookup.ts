import { useEffect, useMemo, useState } from "react";
import { trpc } from "@/lib/server/client";
import { useCachedDataContext } from "@/app/(site)/context/CachedDataContext";
import { AddressType, CustomerType } from "@/prisma/generated/schemas";

interface UseCustomerLookupParams {
  initialPhone: string;
  initialDoorbell: string;
  onReset: () => void;
}

/**
 * Hook for looking up customers by phone or doorbell.
 * Uses cached customers for instant lookup,
 * and falls back to tRPC for freshness if not found locally.
 */
export default function useCustomerLookup({
  initialPhone,
  initialDoorbell,
  onReset,
}: UseCustomerLookupParams) {
  const [phone, setPhone] = useState<string>(initialPhone || "");
  const [doorbell, setDoorbell] = useState<string>(initialDoorbell || "");

  // ⚡ Use global cached customers, each with .addresses included
  const { customers: cachedCustomers } = useCachedDataContext();

  // ✅ Find customer by phone (cache first)
  const cachedCustomer = useMemo(() => {
    if (!phone) return undefined;
    const normalized = phone.replace(/\s+/g, "");
    return cachedCustomers.find((c) => c.phone?.phone?.replace(/\s+/g, "") === normalized);
  }, [cachedCustomers, phone]);

  // ✅ Find possible matches by doorbell (cache first)
  const cachedPossibleCustomers = useMemo(() => {
    if (!doorbell) return [];
    const lowerDoorbell = doorbell.toLowerCase();
    return cachedCustomers.filter((c) =>
      c.addresses?.some((a) => a.doorbell?.toLowerCase() === lowerDoorbell)
    );
  }, [cachedCustomers, doorbell]);

  // ✅ Cached addresses directly from customer object
  const cachedAddresses = useMemo(() => {
    if (!cachedCustomer) return [];
    return cachedCustomer.addresses?.filter((a) => !a.temporary) ?? [];
  }, [cachedCustomer]);

  // --- Network fallback (only if cache miss)
  const { data: fetchedCustomer = undefined } = trpc.customers.getByPhone.useQuery(
    { phone },
    { enabled: !!phone && !cachedCustomer }
  );

  const { data: fetchedAddresses = [] } = trpc.addresses.getByCustomer.useQuery(
    { customerId: fetchedCustomer?.id ?? -1 },
    {
      enabled: !!fetchedCustomer?.id && !cachedCustomer,
      select: (addresses) => addresses.filter((addr) => !addr.temporary),
    }
  );

  const { data: fetchedPossibleCustomers = [] } = trpc.customers.getByDoorbell.useQuery(
    { doorbell },
    {
      enabled: !!doorbell && cachedPossibleCustomers.length === 0,
    }
  );

  // --- Reset behavior (unchanged)
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

  // --- Merge cache + network results
  const customer = cachedCustomer || fetchedCustomer || undefined;
  const addresses = cachedAddresses.length > 0 ? cachedAddresses : fetchedAddresses;
  const possibleCustomers =
    cachedPossibleCustomers.length > 0 ? cachedPossibleCustomers : fetchedPossibleCustomers;

  return {
    customer,
    addresses,
    phone,
    doorbell,
    possibleCustomers,
    setPhone,
    setDoorbell,
  };
}
