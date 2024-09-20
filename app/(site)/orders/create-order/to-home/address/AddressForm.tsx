import { Address, Customer } from "@prisma/client";
import { Dispatch, KeyboardEvent, RefObject, SetStateAction, useEffect, useState } from "react";
import { Form } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import FormField from "@/app/(site)/components/FormField";
import fetchRequest from "@/app/(site)/util/functions/fetchRequest";
import parseAddress from "@/app/(site)/util/functions/parseAddress";
import getForm from "@/app/(site)/util/functions/getForm";
import formSchema from "./form";
import { z } from "zod";
import { toastSuccess } from "@/app/(site)/util/toast";

function getActionType(object: object | undefined): string {
  return object === undefined ? "create" : "update";
}

export type ExternalInfo = {
  notes?: string | undefined;
  contactPhone?: string | undefined;
};

export default function AddressForm({
  customer,
  selectedAddress,
  setSelectedAddress,
  selectedOption,
  setCustomer,
  phone,
  setAddresses,
  formRef,
  handleKeyDown,
  refs,
  createHomeOrder,
  setExternalInfo,
  externalInfo,
}: {
  customer: Customer | undefined;
  selectedAddress: Address | undefined;
  setSelectedAddress: Dispatch<SetStateAction<Address | undefined>>;
  selectedOption: string;
  setCustomer: Dispatch<SetStateAction<Customer | undefined>>;
  phone: string;
  setAddresses: Dispatch<SetStateAction<Address[]>>;
  formRef: any;
  handleKeyDown: (e: KeyboardEvent) => void;
  refs: RefObject<any>[];
  createHomeOrder: (address: Address, externalInfo: ExternalInfo) => void;
  setExternalInfo: Dispatch<SetStateAction<ExternalInfo>>;
  externalInfo: ExternalInfo;
}) {
  const form = getForm(formSchema);

  const handleCustomerUpdate = async (actionCustomer: string, customerContent: object) => {
    const updatedCustomer = await fetchRequest<Customer>(
      "POST",
      "/api/customers/",
      actionCustomer === "create" ? "createCustomer" : "updateCustomerFromOrder",
      actionCustomer === "create" ? { phone, customer: customerContent } : customerContent
    );

    setCustomer(updatedCustomer);
    return updatedCustomer;
  };

  const handleAddressUpdate = async (
    customerId: number,
    actionAddress: string,
    addressContent: object
  ) => {
    const updatedAddress = await fetchRequest<Address>(
      "POST",
      "/api/addresses/",
      actionAddress === "create" ? "createAddress" : "updateAddress",
      { ...addressContent, customer_id: customerId }
    );

    setSelectedAddress(updatedAddress);
    setAddresses((prevAddresses) => {
      const addressExists = prevAddresses.some((address) => address.id === updatedAddress.id);

      return addressExists
        ? prevAddresses.map((address) =>
            address.id === updatedAddress.id ? updatedAddress : address
          )
        : [...prevAddresses, updatedAddress];
    });

    return updatedAddress;
  };

  async function onSubmit(values: Partial<z.infer<typeof formSchema>>) {
    const { street, civic } = parseAddress(values.street);
    const actionCustomer = getActionType(customer);
    const actionAddress = getActionType(selectedAddress);

    const customerContent = {
      name: values.name,
      surname: values.surname,
      preferences: values.preferences,
      email: values.email,
      id: customer?.id,
    };

    const addressContent = {
      customer_id: customer?.id,
      street,
      civic,
      doorbell: values.doorbell,
      floor: values.floor,
      stair: values.stair,
      street_info: values.street_info,
      temporary: selectedOption === "temp",
      id: selectedAddress?.id,
    };

    const newExternalInfo = { notes: values.notes, contactPhone: values.contact_phone };
    setExternalInfo(newExternalInfo);

    const updatedCustomer = await handleCustomerUpdate(actionCustomer, customerContent);
    const updatedAddress = await handleAddressUpdate(
      updatedCustomer.id,
      actionAddress,
      addressContent
    );

    toastSuccess("Il cliente e i suoi indirizzi sono stato correttamente aggiornato");

    //createHomeOrder(updatedAddress, newExternalInfo);
  }

  useEffect(() => {
    form.reset({
      street:
        selectedAddress?.street && selectedAddress?.civic
          ? `${selectedAddress.street} ${selectedAddress.civic}`
          : "",
      name: customer?.name || "",
      surname: customer?.surname || "",
      floor: selectedAddress?.floor || "",
      stair: selectedAddress?.stair || "",
      street_info: selectedAddress?.street_info || "",
      notes: externalInfo.notes,
      contact_phone: externalInfo.contactPhone,
      doorbell: selectedAddress?.doorbell || "",
      email: customer?.email || "",
      preferences: customer?.preferences || "",
    });

    form.clearErrors();
  }, [selectedAddress, customer, phone]);

  useEffect(() => setExternalInfo({ contactPhone: "", notes: "" }), [phone]);

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
              name="floor"
              label="Piano"
              handleKeyDown={handleKeyDown}
              className="h-14 text-2xl uppercase"
            />
          </div>

          <div className="flex justify-between gap-4">
            <FormField
              ref={refs[3]}
              control={form.control}
              name="contact_phone"
              type="number"
              handleKeyDown={handleKeyDown}
              className="h-14 text-2xl uppercase"
              label="Num. telefono addizionale"
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
        </form>
      </Form>
    </div>
  );
}
