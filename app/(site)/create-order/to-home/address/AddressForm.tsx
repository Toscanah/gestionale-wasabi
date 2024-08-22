import { Address, Customer } from "@prisma/client";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import getToHomeForm, { FormValues } from "../../../components/forms/getToHomeForm";
import { Textarea } from "@/components/ui/textarea";
import WhenSelector from "@/app/(site)/components/select/WhenSelector";
import FormField from "@/app/(site)/components/FormField";
import fetchRequest from "@/app/(site)/util/functions/fetchRequest";
import parseAddress from "@/app/(site)/util/functions/parseAddress";
import { useFocusCycle } from "@/app/(site)/components/hooks/useFocusCycle";
import { UseFormReturn } from "react-hook-form";

export default function AddressForm({
  addInfo,
  setAddInfo,
  customer,
  selectedAddress,
  setSelectedAddress,
  highlight,
  setCustomer,
  phone,
  setAddresses,
  formRef,
  setShouldCreateOrder,
}: {
  addInfo: {
    notes: string | undefined;
    when: string | undefined;
    contactPhone: string | undefined;
  };
  setAddInfo: Dispatch<
    SetStateAction<{
      notes: string | undefined;
      when: string | undefined;
      contactPhone: string | undefined;
    }>
  >;
  customer: Customer | undefined;
  selectedAddress: Address | undefined;
  setSelectedAddress: Dispatch<SetStateAction<Address | undefined>>;
  highlight: string;
  setCustomer: Dispatch<SetStateAction<Customer | undefined>>;
  phone: string;
  setHighlight: Dispatch<SetStateAction<string>>;
  setAddresses: Dispatch<SetStateAction<Address[]>>;
  formRef: any;
  setShouldCreateOrder: Dispatch<SetStateAction<boolean>>;
}) {
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
    streetRef,
    bellRef,
    contactRef,
    floorRef,
    stairRef,
    nameRef,
    surnameRef,
    infoRef,
    notesRef,
    prefRef,
  ]);

  const form = getToHomeForm();

  function onSubmit(values: FormValues) {
    const { street, civic } = parseAddress(values.street);

    setAddInfo({
      notes: values.notes,
      when: values.when,
      contactPhone: values.contact_phone,
    });

    function getActionType(object: object | undefined): string {
      return object === undefined ? "create" : "update";
    }

    const actionCustomer = getActionType(customer);
    const actionAddress = getActionType(selectedAddress);

    const customerContent = {
      name: values.name,
      surname: values.surname,
      preferences: values.preferences,
      id: customer?.id,
    };

    const addressContent = {
      customer_id: customer?.id,
      street: street,
      civic: civic,
      doorbell: values.doorbell,
      floor: values.floor,
      stair: values.stair,
      street_info: values.street_info,
      temporary: highlight === "temp",
      id: selectedAddress?.id,
    };

    fetchRequest<Customer>(
      "POST",
      "/api/customers/",
      actionCustomer === "create" ? "createCustomer" : "updateCustomer",
      actionCustomer === "create" ? { phone, customer: customerContent } : customerContent
    )
      .then((updatedCustomer) => {
        setCustomer(updatedCustomer);

        return fetchRequest<Address>(
          "POST",
          "/api/addresses/",
          actionAddress === "create" ? "createAddress" : "updateAddress",
          { ...addressContent, customer_id: updatedCustomer.id }
        );
      })
      .then((updatedAddress) => {
        setSelectedAddress(updatedAddress);

        setAddresses((prevAddresses) => {
          const addressExists = prevAddresses.some((address) => address.id === updatedAddress.id);

          const newAddresses = addressExists
            ? prevAddresses.map((address) =>
                address.id === updatedAddress.id ? updatedAddress : address
              )
            : [...prevAddresses, updatedAddress];

          return newAddresses;
        });
      })
      .then(() => {
        setShouldCreateOrder(true);
      });
  }

  useEffect(() => {
    let street;

    if (selectedAddress?.street == undefined || selectedAddress?.civic == undefined) {
      street = "";
    } else {
      street = (selectedAddress?.street || "") + " " + (selectedAddress?.civic || "");
    }

    form.reset({
      street: street,
      name: customer?.name || "",
      surname: customer?.surname || "",
      floor: selectedAddress?.floor || "",
      stair: selectedAddress?.stair || "",
      street_info: selectedAddress?.street_info || "",
      notes: addInfo.notes,
      contact_phone: addInfo.contactPhone,
      doorbell: selectedAddress?.doorbell || "",
      email: customer?.email || "",
      when: addInfo.when || "immediate",
      preferences: customer?.preferences || "",
    });
    form.clearErrors();
  }, [selectedAddress, customer]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <Form {...form}>
        <form
          ref={formRef}
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full flex flex-col justify-between h-full"
        >
          <FormField
            autofocus
            control={form.control}
            name="street"
            ref={streetRef}
            label="Via"
            handleKeyDown={handleKeyDown}
            className="h-14 text-2xl uppercase"
            example="(es. Via dei Giacinti 41) "
          />

          <div className="flex justify-between gap-4">
            <FormField
              control={form.control}
              name="doorbell"
              ref={bellRef}
              handleKeyDown={handleKeyDown}
              className="h-14 text-2xl uppercase"
              label="Campanello"
              example="(es. Rossi)"
            />
            <FormField
              control={form.control}
              name="contact_phone"
              ref={contactRef}
              type="number"
              handleKeyDown={handleKeyDown}
              className="h-14 text-2xl uppercase"
              label="Num. telefono addizionale"
            />
          </div>

          <div className="flex justify-between gap-4">
            <FormField
              control={form.control}
              name="floor"
              label="Piano"
              ref={floorRef}
              handleKeyDown={handleKeyDown}
              className="h-14 text-2xl uppercase"
            />
            <FormField
              control={form.control}
              name="stair"
              label="Scala"
              ref={stairRef}
              handleKeyDown={handleKeyDown}
              className="h-14 text-2xl uppercase"
              example="(dx / sx)"
            />
          </div>

          <div className="flex justify-between gap-4">
            <FormField
              control={form.control}
              name="name"
              label="Nome"
              ref={nameRef}
              handleKeyDown={handleKeyDown}
              className="h-14 text-2xl uppercase"
            />
            <FormField
              control={form.control}
              name="surname"
              ref={surnameRef}
              handleKeyDown={handleKeyDown}
              label="Cognome"
              className="h-14 text-2xl uppercase"
            />
          </div>

          <FormField
            control={form.control}
            name="email"
            ref={emailRef}
            label="Email"
            handleKeyDown={handleKeyDown}
            className="h-14 text-2xl uppercase"
            example="(es. mario.rossi@gmail.com)"
          />

          <div className="flex justify-between gap-4">
            <FormField
              control={form.control}
              name="street_info"
              ref={infoRef}
              handleKeyDown={handleKeyDown}
              label="Informazioni stradali"
              example="(es. Arrivare da Via Udine..)"
            >
              <Textarea className="resize-none text-xl uppercase" />
            </FormField>

            <FormField
              control={form.control}
              name="notes"
              ref={notesRef}
              handleKeyDown={handleKeyDown}
              label="Note sull'ordine"
              example="(es. Extra wasabi, no zenzero)"
            >
              <Textarea className="resize-none text-xl uppercase" />
            </FormField>

            <FormField
              control={form.control}
              name="preferences"
              ref={prefRef}
              handleKeyDown={handleKeyDown}
              label="Preferenze cliente"
              example="(es. Intollerante, coca zero)"
            >
              <Textarea className="resize-none text-xl uppercase" />
            </FormField>
          </div>

          <FormField control={form.control} name="when" label="Quando?">
            <WhenSelector isForm className="h-14 text-2xl uppercase" />
          </FormField>
        </form>
      </Form>
    </div>
  );
}
