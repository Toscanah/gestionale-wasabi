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
    if (selectedAddress) {
      setSelectedOption(selectedAddress.temporary ? "temp" : selectedAddress.id.toString());
    } else {
      setSelectedOption(
        lastAddressId?.toString() ??
          (permAddresses.find((addr) => addr.active)?.id.toString() || "new")
      );
    }
  }, [permAddresses]);

  useEffect(() => {
    const address =
      selectedOption === "temp"
        ? tempAddress
        : selectedOption === "new"
          ? undefined
          : addresses.find((addr) => selectedOption === addr.id.toString());

    setSelectedAddress(address);
  }, [selectedOption]);

  return {
    permAddresses,
    tempAddress,
  };
}
