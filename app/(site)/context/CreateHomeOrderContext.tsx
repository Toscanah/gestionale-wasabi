import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";
import { OrderByType, ComprehensiveCustomer } from "@/lib/shared";
import useCustomerLookup from "../../../hooks/create-home-order/useCustomerLookup";
import { useWasabiContext } from "./WasabiContext";
import { AddressFormValues } from "../(domains)/orders/create-order/home/address/form";
import useCustomerManager from "../../../hooks/create-home-order/useCustomerManager";
import useAddressSelection from "../../../hooks/create-home-order/useAddressSelection";
import { trpc } from "@/lib/trpc/client";
import { AddressType, CustomerType } from "@/prisma/generated/schemas";

type CreateHomeOrderType = {
  phone: string;
  setPhone: Dispatch<SetStateAction<string>>;
  customer: CustomerType | undefined;
  selectedAddress: AddressType | undefined;
  setExtraInfo: Dispatch<SetStateAction<ExtraInfo>>;
  extraInfo: ExtraInfo;
  addresses: AddressType[];
  setSelectedAddress: Dispatch<SetStateAction<AddressType | undefined>>;
  initialPhone: string;
  initialDoorbell: string;
  selectedOption: string;
  setSelectedOption: Dispatch<SetStateAction<string>>;
  onSubmit: (values: AddressFormValues) => Promise<void>;
  createHomeOrder: () => void;
  setDoorbell: Dispatch<SetStateAction<string>>;
  doorbell: string;
  permAddresses: AddressType[];
  tempAddress: AddressType | undefined;
  possibleCustomers: ComprehensiveCustomer[];
  toggleCustomerAddress: (addressId: number, active: boolean) => Promise<void>;
};

type CreateHomeOrderProps = {
  children: ReactNode;
  setOrder: Dispatch<SetStateAction<OrderByType>>;
  initialPhone: string;
  initialDoorbell: string;
};

const CreateHomeOrderContext = createContext<CreateHomeOrderType | undefined>(undefined);

export type ExtraInfo = {
  contactPhone?: string | undefined;
};

export const CreateHomeOrderProvider = ({
  children,
  setOrder,
  initialPhone,
  initialDoorbell,
}: CreateHomeOrderProps) => {
  const [extraInfo, setExtraInfo] = useState<ExtraInfo>({ contactPhone: "" });
  const [selectedAddress, setSelectedAddress] = useState<AddressType | undefined>(undefined);
  const [selectedOption, setSelectedOption] = useState<string>("");

  const handleResetState = () => {
    setSelectedAddress(undefined);
  };

  const { updateGlobalState } = useWasabiContext();
  const { customer, addresses, phone, doorbell, setPhone, setDoorbell, possibleCustomers } =
    useCustomerLookup({ initialPhone, initialDoorbell, onReset: handleResetState });

  const { onSubmit, toggleCustomerAddress } = useCustomerManager({
    phone,
    customer,
    selectedAddress,
    setExtraInfo,
    selectedOption,
    setSelectedAddress,
    setSelectedOption,
  });

  const { permAddresses, tempAddress } = useAddressSelection({
    addresses,
    phone,
    selectedAddress,
    setSelectedAddress,
    selectedOption,
    setSelectedOption,
  });

  const createHomeOrderMutation = trpc.orders.createHome.useMutation({
    onSuccess: (newHomeOrder) => {
      setOrder(newHomeOrder);
      updateGlobalState(newHomeOrder, "add");
    },
  });

  const createHomeOrder = () => {
    if (!customer || !selectedAddress) return;

    createHomeOrderMutation.mutate({
      customerId: customer.id,
      addressId: selectedAddress.id,
      contactPhone: extraInfo.contactPhone || "",
    });
  };

  useEffect(() => setExtraInfo({ contactPhone: "" }), [phone]);

  return (
    <CreateHomeOrderContext.Provider
      value={{
        setSelectedAddress,
        possibleCustomers,
        tempAddress,
        setExtraInfo,
        initialPhone,
        setDoorbell,
        doorbell,
        initialDoorbell,
        phone,
        createHomeOrder,
        customer,
        selectedAddress,
        onSubmit,
        extraInfo,
        selectedOption,
        setSelectedOption,
        addresses,
        setPhone,
        permAddresses,
        toggleCustomerAddress,
      }}
    >
      {children}
    </CreateHomeOrderContext.Provider>
  );
};

export const useCreateHomeOrder = () => {
  const context = useContext(CreateHomeOrderContext);
  if (context === undefined) {
    throw new Error("useCreateHomeOrder must be used within an CreateHomeOrderProvider");
  }
  return context;
};
