import { Separator } from "@/components/ui/separator";
import Overview from "./address/Overview";
import { debounce } from "lodash";
import AddressForm from "./address/AddressForm";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { Address, Customer } from "@prisma/client";
import fetchRequest from "../../util/functions/fetchRequest";
import { AnyOrder, HomeOrder } from "../../types/OrderType";
import { useWasabiContext } from "../../components/WasabiContext";
import { TypesOfOrder } from "../../types/TypesOfOrder";
import getToHomeForm from "../../components/forms/getToHomeForm";

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
      onOrdersUpdate(TypesOfOrder.TO_HOME);
    });
  };

  useEffect(() => {
    if (shouldCreateOrder) {
      createHomeOrder();
      setShouldCreateOrder(false);
    }
  }, [addInfo, customer, selectedAddress, shouldCreateOrder]);

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
      />

      <Separator orientation="vertical" />

      <div className="w-[70%] h-full ">
        {phone.length > 0 && (
          <AddressForm
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
