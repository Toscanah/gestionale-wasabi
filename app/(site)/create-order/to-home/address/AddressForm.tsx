import { Address, Customer } from "@prisma/client";
import { Dispatch, KeyboardEvent, RefObject, SetStateAction, useEffect, useRef } from "react";
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
  handleKeyDown,
  refs,
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
  handleKeyDown: (e: KeyboardEvent) => void;
  refs: RefObject<any>[];
}) {
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
      actionCustomer === "create" ? "createCustomer" : "updateCustomerFromOrder",
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
            control={form.control}
            name="street"
            ref={refs[0]}
            //autofocus={phone.length >= 9}
            label="Via"
            handleKeyDown={handleKeyDown}
            className="h-14 text-2xl uppercase"
            example="(es. Via dei Giacinti 41)"
          />

          <div className="flex justify-between gap-4">
            <FormField
              ref={refs[1]}
              control={form.control}
              name="doorbell"
              handleKeyDown={handleKeyDown}
              className="h-14 text-2xl uppercase"
              label="Campanello"
              example="(es. Rossi)"
            />
            <FormField
              ref={refs[2]}
              control={form.control}
              name="contact_phone"
              type="number"
              handleKeyDown={handleKeyDown}
              className="h-14 text-2xl uppercase"
              label="Num. telefono addizionale"
            />
          </div>

          <div className="flex justify-between gap-4">
            <FormField
              ref={refs[3]}
              control={form.control}
              name="floor"
              label="Piano"
              handleKeyDown={handleKeyDown}
              className="h-14 text-2xl uppercase"
            />
            <FormField
              ref={refs[4]}
              control={form.control}
              name="stair"
              label="Scala"
              handleKeyDown={handleKeyDown}
              className="h-14 text-2xl uppercase"
              example="(dx / sx)"
            />
          </div>

          <div className="flex justify-between gap-4">
            <FormField
              control={form.control}
              name="name"
              ref={refs[5]}
              label="Nome"
              handleKeyDown={handleKeyDown}
              className="h-14 text-2xl uppercase"
            />
            <FormField
              control={form.control}
              name="surname"
              ref={refs[6]}
              handleKeyDown={handleKeyDown}
              label="Cognome"
              className="h-14 text-2xl uppercase"
            />
          </div>

          <FormField
            control={form.control}
            name="email"
            label="Email"
            ref={refs[7]}
            handleKeyDown={handleKeyDown}
            className="h-14 text-2xl uppercase"
            example="(es. mario.rossi@gmail.com)"
          />

          <div className="flex justify-between gap-4">
            <FormField
              control={form.control}
              name="street_info"
              ref={refs[8]}
              handleKeyDown={handleKeyDown}
              label="Informazioni stradali"
              example="(es. Arrivare da Via Udine..)"
            >
              <Textarea className="resize-none text-xl uppercase" />
            </FormField>

            <FormField
              control={form.control}
              name="notes"
              ref={refs[9]}
              handleKeyDown={handleKeyDown}
              label="Note sull'ordine"
              example="(es. Extra wasabi, no zenzero)"
            >
              <Textarea className="resize-none text-xl uppercase" />
            </FormField>

            <FormField
              control={form.control}
              name="preferences"
              ref={refs[10]}
              handleKeyDown={handleKeyDown}
              label="Preferenze cliente"
              example="(es. Intollerante, coca zero)"
            >
              <Textarea className="resize-none text-xl uppercase" />
            </FormField>
          </div>

          {/* <FormField control={form.control} name="when" label="Quando?">
            <WhenSelector isForm className="h-14 text-2xl uppercase" />
          </FormField> */}
        </form>
      </Form>
    </div>
  );
}
