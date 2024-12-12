import { Separator } from "@/components/ui/separator";
import Overview from "./address/Overview";
import AddressForm, { ExternalInfo } from "./address/AddressForm";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { Address } from "@prisma/client";
import fetchRequest from "../../../util/functions/fetchRequest";
import { AnyOrder, HomeOrder } from "../../../types/PrismaOrders";
import { useWasabiContext } from "../../../context/WasabiContext";
import { OrderType } from "@prisma/client";
import useFocusCycle from "@/app/(site)/components/hooks/useFocusCycle";
import useFetchCustomer from "@/app/(site)/components/hooks/useFetchCustomer";
import PossibleCustomers from "./possible-customers/PossibleCustomers";

interface HomeProps {
  setOrder: Dispatch<SetStateAction<AnyOrder>>;
}

export default function Home({ setOrder }: HomeProps) {
  const { updateGlobalState } = useWasabiContext();
  const { handleKeyDown, addRefs } = useFocusCycle();

  const formRef = useRef<HTMLFormElement>(null);
  const [externalInfo, setExternalInfo] = useState<ExternalInfo>({ contactPhone: "", notes: "" });
  const [selectedAddress, setSelectedAddress] = useState<Address | undefined>(undefined);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const {
    customer,
    addresses,
    phone,
    doorbellSearch,
    setCustomer,
    setAddresses,
    setPhone,
    setDoorbellSearch,
    possibleCustomers,
  } = useFetchCustomer(setSelectedAddress);

  const createHomeOrder = () =>
    fetchRequest<HomeOrder>("POST", "/api/orders/", "createHomeOrder", {
      customerId: customer?.id,
      address: selectedAddress?.id,
      notes: externalInfo.notes,
      contactPhone: externalInfo.contactPhone,
    }).then((newHomeOrder) => {
      setOrder(newHomeOrder);
      updateGlobalState(newHomeOrder, "add");
    });

  const phoneRef = useRef<HTMLInputElement>(null);
  const doorbellSearchRef = useRef<HTMLInputElement>(null);
  const streetRef = useRef<HTMLInputElement>(null);
  const bellRef = useRef<HTMLInputElement>(null);
  const floorRef = useRef<HTMLInputElement>(null);
  const contactRef = useRef<HTMLInputElement>(null);
  const stairRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const surnameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const infoRef = useRef<HTMLInputElement>(null);
  const notesRef = useRef<HTMLInputElement>(null);
  const prefRef = useRef<HTMLInputElement>(null);

  useEffect(
    () =>
      addRefs(
        phoneRef.current,
        doorbellSearchRef.current,
        streetRef.current,
        bellRef.current,
        floorRef.current,
        stairRef.current,
        contactRef.current,
        nameRef.current,
        surnameRef.current,
        emailRef.current,
        infoRef.current,
        notesRef.current,
        prefRef.current
      ),
    [phone]
  );

  return (
    <div className="w-full flex gap-6 h-full">
      <Overview
        selectedAddress={selectedAddress}
        setSelectedAddress={setSelectedAddress}
        addresses={addresses}
        setPhone={setPhone}
        phone={phone}
        selectedOption={selectedOption}
        setSelectedOption={setSelectedOption}
        formRef={formRef}
        phoneRef={phoneRef}
        doorbellSearchRef={doorbellSearchRef}
        doorbellSearch={doorbellSearch}
        setDoorbellSearch={setDoorbellSearch}
        handleKeyDown={handleKeyDown}
        createHomeOrder={createHomeOrder}
      />

      <Separator orientation="vertical" />

      <div className="w-[70%] h-full ">
        {phone.length > 0 ? (
          <AddressForm
            setExternalInfo={setExternalInfo}
            externalInfo={externalInfo}
            handleKeyDown={handleKeyDown}
            refs={[
              streetRef,
              bellRef,
              floorRef,
              stairRef,
              contactRef,
              nameRef,
              surnameRef,
              emailRef,
              infoRef,
              notesRef,
              prefRef,
            ]}
            formRef={formRef}
            customer={customer}
            selectedAddress={selectedAddress}
            setSelectedAddress={setSelectedAddress}
            selectedOption={selectedOption}
            setCustomer={setCustomer}
            phone={phone}
            setAddresses={setAddresses}
          />
        ) : (
          doorbellSearch.length > 0 &&
          possibleCustomers.length > 0 && (
            <PossibleCustomers possibleCustomers={possibleCustomers} setPhone={setPhone} />
          )
        )}
      </div>
    </div>
  );
}
