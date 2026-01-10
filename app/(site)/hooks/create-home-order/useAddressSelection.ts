import { useEffect, useMemo, useState } from "react";
import { trpc } from "@/lib/server/client";
import { AddressType } from "@/prisma/generated/schemas";

interface UseAddressSelectionParams {
  addresses: AddressType[];
  phone: string;
  selectedAddress: AddressType | undefined;
  setSelectedAddress: (address: AddressType | undefined) => void;
  selectedOption: string;
  setSelectedOption: (option: string) => void;
}

export default function useAddressSelection({
  addresses,
  phone,
  selectedAddress,
  setSelectedAddress,
  selectedOption,
  setSelectedOption,
}: UseAddressSelectionParams) {
  const permAddresses = useMemo(
    () => addresses.filter((address) => !address.temporary),
    [addresses]
  );

  const tempAddress = useMemo(() => addresses.find((address) => address.temporary), [addresses]);

  const { data: lastAddressId } = trpc.addresses.getLastOfCustomer.useQuery(
    { phone },
    {
      enabled: Boolean(phone && !selectedAddress),
    }
  );

  // ✅ EFFECT 1: INITIALIZATION
  // Only runs if 'selectedOption' is empty.
  // This prevents it from overwriting a "new" or manually selected address when 'addresses' updates.
  useEffect(() => {
    if (!selectedOption && lastAddressId) {
      const valid = addresses.some((addr) => addr.id === lastAddressId && addr.active)
        ? lastAddressId.toString()
        : "";

      if (valid) {
        setSelectedOption(valid);
      }
    }
  }, [lastAddressId, addresses, selectedOption, setSelectedOption]);

  // ✅ EFFECT 2: VALIDATION / FALLBACK
  // Runs when the list changes to ensure the CURRENT selection is still valid.
  useEffect(() => {
    // 🛑 STOP: Race condition fix.
    // If we have no addresses and no selection, we are likely initializing/loading.
    // We don't want to force "new" yet, because 'lastAddressId' might be coming,
    // or the address list might just be loading.

    if (addresses.length === 0 && selectedOption.trim() === "") return;

    // 1. Check if ANY permanent address is active
    const hasActiveAddresses = permAddresses.some((addr) => addr.active);

    // 2. Determine if the current selection is still valid
    const currentSelectionIsActive = permAddresses.find(
      (addr) => addr.id.toString() === selectedOption
    )?.active;

    // EDGE CASE: If nothing is active, OR the current selection just got toggled OFF
    // We ignore "new" and "temp" here because we don't want to auto-switch away from them
    // unless the user specifically toggled something off that was previously selected.
    if (
      !hasActiveAddresses ||
      (selectedOption !== "new" && selectedOption !== "temp" && !currentSelectionIsActive)
    ) {
      // Fallback logic
      if (hasActiveAddresses) {
        // If there are other active addresses, pick the last used (if valid) or the first available
        const isLastValid = permAddresses.find((a) => a.id === lastAddressId && a.active);
        const firstActive = permAddresses.find((a) => a.active);

        const fallback = isLastValid ? lastAddressId?.toString() : firstActive?.id.toString();

        // Only update if we are actually changing the value
        if (fallback && selectedOption !== fallback) {
          setSelectedOption(fallback);
        }
      } else {
        // If absolutely NOTHING is active, force "new"
        if (selectedOption !== "new" && selectedOption !== "temp") {
          setSelectedOption("new");
        }
      }
    }
  }, [permAddresses, selectedOption, lastAddressId, setSelectedOption, addresses.length]);

  // ✅ EFFECT 3: SYNC OBJECT
  // Keeps the full address object in sync with the selected ID string
  useEffect(() => {
    const address =
      selectedOption === "temp"
        ? tempAddress
        : selectedOption === "new"
          ? undefined
          : addresses.find((addr) => selectedOption === addr.id.toString() && addr.active);

    setSelectedAddress(address);
  }, [selectedOption, addresses, tempAddress, setSelectedAddress]);

  return {
    permAddresses,
    tempAddress,
  };
}
