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
      enabled: Boolean(phone && !selectedAddress && permAddresses.length > 0),
    }
  );

  useEffect(() => {
    if (lastAddressId) {
      const valid = addresses.some((addr) => addr.id === lastAddressId && addr.active)
        ? lastAddressId.toString()
        : "";

      setSelectedOption(valid);
    }
  }, [lastAddressId, addresses]);

  useEffect(() => {
    // 1. Check if ANY permanent address is active
    const hasActiveAddresses = permAddresses.some((addr) => addr.active);

    // 2. Determine if the current selection is still valid
    const currentSelectionIsActive = permAddresses.find(
      (addr) => addr.id.toString() === selectedOption
    )?.active;

    // EDGE CASE: If nothing is active, OR the current selection just got toggled OFF
    if (
      !hasActiveAddresses ||
      (selectedOption !== "new" && selectedOption !== "temp" && !currentSelectionIsActive)
    ) {
      // Fallback logic
      if (hasActiveAddresses) {
        // If there are other active addresses, pick the last used or the first available
        const isLastValid = permAddresses.find((a) => a.id === lastAddressId && a.active);
        const firstActive = permAddresses.find((a) => a.active);

        const fallback = isLastValid ? lastAddressId?.toString() : firstActive?.id.toString();
        if (fallback && selectedOption !== fallback) {
          setSelectedOption(fallback);
        }
      } else {
        // If absolutely NOTHING is active, force "new"
        if (selectedOption !== "new" && selectedOption !== "temp") {
          setSelectedOption("new");
        }
      }
      return;
    }

    // 3. Initial Load logic (if no option is selected yet)
    if (!selectedOption && lastAddressId) {
      const isLastValid = permAddresses.some((addr) => addr.id === lastAddressId && addr.active);
      if (isLastValid) {
        setSelectedOption(lastAddressId.toString());
      }
    }
  }, [permAddresses, lastAddressId, selectedOption]);

  useEffect(() => {
    const address =
      selectedOption === "temp"
        ? tempAddress
        : selectedOption === "new"
          ? undefined
          : addresses.find((addr) => selectedOption === addr.id.toString() && addr.active);

    setSelectedAddress(address);
  }, [selectedOption]);

  return {
    permAddresses,
    tempAddress,
  };
}
