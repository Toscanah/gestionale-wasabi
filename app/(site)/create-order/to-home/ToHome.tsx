import { Separator } from "@/components/ui/separator";
import Overview from "./address/Overview";
import { debounce } from "lodash";
import AddressForm from "./address/AddressForm";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { Address, Customer } from "@prisma/client";
import fetchRequest from "../../util/functions/fetchRequest";
import { AnyOrder, HomeOrder } from "../../types/PrismaOrders";
import { useWasabiContext } from "../../context/WasabiContext";
import { OrderType } from "../../types/OrderType";
import getToHomeForm from "../../components/forms/getToHomeForm";
import { useFocusCycle } from "../../components/hooks/useFocusCycle";

export default function ToHome({
  setOrder,
}: {
  setOrder: Dispatch<SetStateAction<AnyOrder | undefined>>;
}) {
  const { onOrdersUpdate } = useWasabiContext();
  const [selectedAddress, setSelectedAddress] = useState<Address | undefined>(undefined);
  const [customer, setCustomer] = useState<Customer | undefined>(undefined);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [phone, setPhone] = useState<string>("");
  const [highlight, setHighlight] = useState<string>("");
  const [addInfo, setAddInfo] = useState<{
    notes: string | undefined;
    when: string | undefined;
    contactPhone: string | undefined;
  }>({ notes: "", when: "", contactPhone: "" });
  const formRef = useRef<HTMLFormElement>(null);
  const [shouldCreateOrder, setShouldCreateOrder] = useState(false);

  const fetchCustomer = async () => {
    const customer = await fetchRequest<Customer>("GET", "/api/customers", "getSingle", {
      phone,
    });
    setCustomer(customer ? customer : undefined);
    if (!customer) {
      setAddresses([]);
    }
    return customer;
  };

  const fetchAddresses = (customerId: number) => {
    fetchRequest<Address[]>("GET", "/api/addresses/", "getAddressesByCustomer", {
      customerId: customerId,
    }).then((addresses) =>
      setAddresses(addresses.length > 0 ? addresses.filter((address) => !address.temporary) : [])
    );
  };

  const debouncedFetchCustomer = debounce(async () => {
    const customer = await fetchCustomer();
    if (customer) {
      fetchAddresses(customer.id);
    }
  }, 300);

  useEffect(() => {
    if (phone) {
      setSelectedAddress(undefined);
      setAddresses([]);
      setAddInfo({ notes: "", contactPhone: "", when: "immediate" });
      debouncedFetchCustomer();
    }

    return () => {
      debouncedFetchCustomer.cancel();
    };
  }, [phone]);

  const createHomeOrder = () => {
    fetchRequest<HomeOrder>("POST", "/api/orders/", "createHomeOrder", {
      customer: customer,
      address: selectedAddress,
      notes: addInfo.notes,
      when: addInfo.when,
      contact_phone: addInfo.contactPhone,
    }).then((order) => {
      setOrder(order);
      onOrdersUpdate(OrderType.TO_HOME);
    });
  };

  useEffect(() => {
    if (shouldCreateOrder) {
      createHomeOrder();
      setShouldCreateOrder(false);
    }
  }, [addInfo, customer, selectedAddress, shouldCreateOrder]);

  const phoneRef = useRef<HTMLInputElement>(null);
  const streetRef = useRef<HTMLInputElement>(null);
  const bellRef = useRef<HTMLInputElement>(null);
  const contactRef = useRef<HTMLInputElement>(null);
  const floorRef = useRef<HTMLInputElement>(null);
  const stairRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const surnameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const infoRef = useRef<HTMLInputElement>(null);
  const notesRef = useRef<HTMLInputElement>(null);
  const prefRef = useRef<HTMLInputElement>(null);

  const { handleKeyDown } = useFocusCycle([
    phoneRef,
    streetRef,
    bellRef,
    contactRef,
    floorRef,
    stairRef,
    nameRef,
    surnameRef,
    emailRef,
    infoRef,
    notesRef,
    prefRef,
  ]);

  return (
    <div className="w-full flex gap-6 h-full">
      <Overview
        selectedAddress={selectedAddress}
        setSelectedAddress={setSelectedAddress}
        addresses={addresses}
        setPhone={setPhone}
        phone={phone}
        highlight={highlight}
        setHighlight={setHighlight}
        formRef={formRef}
        phoneRef={phoneRef}
        handleKeyDown={handleKeyDown}
      />

      <Separator orientation="vertical" />

      <div className="w-[70%] h-full ">
        {phone.length > 0 && (
          <AddressForm
            handleKeyDown={handleKeyDown}
            refs={[
              streetRef,
              bellRef,
              contactRef,
              floorRef,
              stairRef,
              nameRef,
              surnameRef,
              emailRef,
              infoRef,
              notesRef,
              prefRef,
            ]}
            setShouldCreateOrder={setShouldCreateOrder}
            formRef={formRef}
            addInfo={addInfo}
            setAddInfo={setAddInfo}
            customer={customer}
            selectedAddress={selectedAddress}
            setSelectedAddress={setSelectedAddress}
            highlight={highlight}
            setCustomer={setCustomer}
            phone={phone}
            setHighlight={setHighlight}
            setAddresses={setAddresses}
          />
        )}
      </div>
    </div>
  );
}
