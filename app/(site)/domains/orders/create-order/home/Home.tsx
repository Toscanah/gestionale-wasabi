import { Separator } from "@/components/ui/separator";
import Overview from "./address/Overview";
import AddressForm from "./address/AddressForm";
import { useEffect, useRef } from "react";
import useFocusCycle from "@/app/(site)/hooks/useFocusCycle";
import PossibleCustomers from "./possible-customers/PossibleCustomers";
import { useCreateHomeOrder } from "@/app/(site)/context/CreateHomeOrderContext";

export default function Home() {
  const { handleKeyDown, addRefs } = useFocusCycle();
  const { phone, doorbell, possibleCustomers } = useCreateHomeOrder();

  const formRef = useRef<HTMLFormElement>(null);
  const createOrderRef = useRef<HTMLButtonElement>(null);

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
        createOrderRef={createOrderRef}
        doorbellRef={doorbellSearchRef}
        formRef={formRef}
        handleKeyDown={handleKeyDown}
        phoneRef={phoneRef}
      />

      <Separator orientation="vertical" />

      <div className="w-[70%] h-full ">
        {phone.length > 0 ? (
          <AddressForm
            formRef={formRef}
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
          />
        ) : (
          doorbell.length > 0 && possibleCustomers.length > 0 && <PossibleCustomers />
        )}
      </div>
    </div>
  );
}
