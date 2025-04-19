import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";
import { AnyOrder, CustomerWithDetails, HomeOrder } from "@shared"
;
import useCustomerLookup from "../hooks/create-home-order/useCustomerLookup";
import fetchRequest from "../lib/api/fetchRequest";
import { useWasabiContext } from "./WasabiContext";
import { Address, Customer } from "@prisma/client";
import { FormValues } from "../orders/create-order/home/address/form";
import useCustomerManager from "../hooks/create-home-order/useCustomerManager";
import useAddressSelection from "../hooks/create-home-order/useAddressSelection";

type CreateHomeOrderType = {
  phone: string;
  setPhone: Dispatch<SetStateAction<string>>;
  setCustomer: Dispatch<SetStateAction<Customer | undefined>>;
  customer: Customer | undefined;
  selectedAddress: Address | undefined;
  setExtraInfo: Dispatch<SetStateAction<ExtraInfo>>;
  extraInfo: ExtraInfo;
  addresses: Address[];
  setAddresses: Dispatch<SetStateAction<Address[]>>;
  setSelectedAddress: Dispatch<SetStateAction<Address | undefined>>;
  initialPhone: string;
  initialDoorbell: string;
  selectedOption: string;
  setSelectedOption: Dispatch<SetStateAction<string>>;
  onSubmit: (values: FormValues) => Promise<void>;
  createHomeOrder: () => void;
  setDoorbell: Dispatch<SetStateAction<string>>;
  doorbell: string;
  permAddresses: Address[];
  tempAddress: Address | undefined;
  setPossibleCustomers: Dispatch<SetStateAction<CustomerWithDetails[]>>;
  possibleCustomers: CustomerWithDetails[];
};

type CreateHomeOrderProps = {
  children: ReactNode;
  setOrder: Dispatch<SetStateAction<AnyOrder>>;
  initialPhone: string;
  initialDoorbell: string;
};

const CreateHomeOrderContext = createContext<CreateHomeOrderType | undefined>(undefined);

export type ExtraInfo = {
  notes?: string | undefined;
  contactPhone?: string | undefined;
};

export const CreateHomeOrderProvider = ({
  children,
  setOrder,
  initialPhone,
  initialDoorbell,
}: CreateHomeOrderProps) => {
  const [extraInfo, setExtraInfo] = useState<ExtraInfo>({ contactPhone: "", notes: "" });
  const [selectedAddress, setSelectedAddress] = useState<Address | undefined>(undefined);
  const [selectedOption, setSelectedOption] = useState<string>("");

  const resetState = () => {
    setAddresses([]);
    setSelectedAddress(undefined);
    setCustomer(undefined);
    setPossibleCustomers([]);
  };

  const { updateGlobalState } = useWasabiContext();
  const {
    customer,
    addresses,
    phone,
    doorbell,
    setCustomer,
    setAddresses,
    setPhone,
    setDoorbell,
    possibleCustomers,
    setPossibleCustomers,
  } = useCustomerLookup({ initialPhone, initialDoorbell, resetState });

  const { onSubmit } = useCustomerManager({
    phone,
    setCustomer,
    customer,
    selectedAddress,
    setExtraInfo,
    setAddresses,
    selectedOption,
    setSelectedAddress,
  });

  const { permAddresses, tempAddress } = useAddressSelection({
    addresses,
    phone,
    selectedAddress,
    setSelectedAddress,
    selectedOption,
    setSelectedOption,
  });

  const createHomeOrder = () => {
    if (!customer || !selectedAddress) return;

    fetchRequest<HomeOrder>("POST", "/api/orders/", "createHomeOrder", {
      customerId: customer.id,
      addressId: selectedAddress.id,
      notes: extraInfo.notes || "",
      contactPhone: extraInfo.contactPhone || "",
    }).then((newHomeOrder) => {
      setOrder(newHomeOrder);
      updateGlobalState(newHomeOrder, "add");
    });
  };

  useEffect(() => setExtraInfo({ contactPhone: "", notes: "" }), [phone]);

  return (
    <CreateHomeOrderContext.Provider
      value={{
        setSelectedAddress,
        possibleCustomers,
        setPossibleCustomers,
        tempAddress,
        setExtraInfo,
        initialPhone,
        setDoorbell,
        doorbell,
        initialDoorbell,
        phone,
        setCustomer,
        createHomeOrder,
        customer,
        selectedAddress,
        onSubmit,
        extraInfo,
        setAddresses,
        selectedOption,
        setSelectedOption,
        addresses,
        setPhone,
        permAddresses,
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
