import { Address } from "@prisma/client";
import { useEffect, useState } from "react";
import { useCreateHomeOrder } from "../../context/CreateHomeOrderContext";
import fetchRequest from "../../lib/api/fetchRequest";
import { HomeOrder } from "@shared"
;

interface UseAddressSelectionParams {
  addresses: Address[];
  phone: string;
  selectedAddress: Address | undefined;
  setSelectedAddress: (address: Address | undefined) => void;
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
  const [permAddresses, setPermAddresses] = useState<Address[]>([]);
  const [tempAddress, setTempAddress] = useState<Address | undefined>();
  const [lastAddressId, setLastAddressId] = useState<string>("");

  useEffect(() => {
    setLastAddressId("");
    setPermAddresses(addresses.filter((address) => !address.temporary));
    setTempAddress(addresses.find((address) => address.temporary));
  }, [addresses]);

  useEffect(() => {
    if (phone && !selectedAddress && permAddresses.length > 0) {
      fetchRequest<number | null>("GET", "/api/addresses/", "getLastAddressOfCustomer", {
        phone,
      }).then((lastAddressId) => {
        if (lastAddressId) {
          const address = addresses.some((addr) => addr.id === lastAddressId && addr.active)
            ? lastAddressId.toString()
            : "";

          setLastAddressId(address);
          setSelectedOption(address);
        }
      });
    }
  }, [permAddresses]);

  useEffect(() => {
    if (selectedAddress) {
      setSelectedOption(selectedAddress.temporary ? "temp" : selectedAddress.id.toString());
    } else {
      setSelectedOption(
        lastAddressId || permAddresses.find((addr) => addr.active)?.id.toString() || "new"
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
