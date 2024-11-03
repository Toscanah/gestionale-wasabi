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

export default function ToHome({
  setOrder,
}: {
  setOrder: Dispatch<SetStateAction<AnyOrder | undefined>>;
}) {
  const { onOrdersUpdate } = useWasabiContext();
  const { handleKeyDown, addRefs } = useFocusCycle();

  const formRef = useRef<HTMLFormElement>(null);
  const [externalInfo, setExternalInfo] = useState<ExternalInfo>({ contactPhone: "", notes: "" });
  const [selectedAddress, setSelectedAddress] = useState<Address | undefined>(undefined);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const { customer, addresses, phone, setCustomer, setAddresses, setPhone } =
    useFetchCustomer(setSelectedAddress);

  const createHomeOrder = () => {
    fetchRequest<HomeOrder>("POST", "/api/orders/", "createHomeOrder", {
      customer: customer,
      address: { ...selectedAddress },
      notes: externalInfo.notes,
      contact_phone: externalInfo.contactPhone,
    }).then((order) => {
      setOrder(order);
      onOrdersUpdate(OrderType.TO_HOME);
    });
  };

  const phoneRef = useRef<HTMLInputElement>(null);
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

  useEffect(() => {
    addRefs(
      phoneRef.current,
      streetRef.current,
      bellRef.current,
      floorRef.current,
      contactRef.current,
      stairRef.current,
      nameRef.current,
      surnameRef.current,
      emailRef.current,
      infoRef.current,
      notesRef.current,
      prefRef.current
    );
  }, [phone]);

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
        handleKeyDown={handleKeyDown}
        createHomeOrder={createHomeOrder}
      />

      <Separator orientation="vertical" />

      <div className="w-[70%] h-full ">
        {phone.length > 0 && (
          <AddressForm
            setExternalInfo={setExternalInfo}
            externalInfo={externalInfo}
            handleKeyDown={handleKeyDown}
            refs={[
              streetRef,
              bellRef,
              floorRef,
              contactRef,
              stairRef,
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
            createHomeOrder={createHomeOrder}
          />
        )}
      </div>
    </div>
  );
}
