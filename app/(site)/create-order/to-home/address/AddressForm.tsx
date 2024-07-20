import { Address, Customer } from "@prisma/client";
import { Dispatch, SetStateAction, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import getCustomerForm, { FormValues } from "./getCustomerForm";
import { Textarea } from "@/components/ui/textarea";
import WhenSelector from "@/app/(site)/components/WhenSelector";
import FormField from "@/app/(site)/components/FormField";
import fetchRequest from "@/app/(site)/util/fetchRequest";

export default function AddressForm({
  setAddInfo,
  customer,
  selectedAddress,
  setSelectedAddress,
  highlight,
  setCustomer,
  phone,
  setHighlight,
  setAddresses,
}: {
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
}) {
  function onSubmit(values: FormValues) {
    setAddInfo({
      notes: values.notes,
      when: values.when ?? "immediate",
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
      id: customer?.id,
    };

    const addressContent = {
      customer_id: customer?.id,
      street: values.street,
      civic: values.civic,
      floor: values.floor,
      cap: values.cap,
      stair: values.stair,
      street_info: values.street_info,
      temporary: highlight === "temp",
      id: selectedAddress?.id,
    };

    fetchRequest("POST", "/api/customers/", {
      requestType:
        actionCustomer === "create" ? "createCustomer" : "updateCustomer",
      content:
        actionCustomer === "create"
          ? { phone, customer: customerContent }
          : customerContent,
    })
      .then((updatedCustomer: Customer) => {
        setCustomer(updatedCustomer);

        return fetchRequest("POST", "/api/addresses/", {
          requestType:
            actionAddress === "create" ? "createAddress" : "updateAddress",
          content: addressContent,
        });
      })
      .then((updatedAddress: Address) => {
        setSelectedAddress(updatedAddress);

        setAddresses((prevAddresses) => {
          const addressExists = prevAddresses.some(
            (address) => address.id === updatedAddress.id
          );

          if (addressExists) {
            return prevAddresses.map((address) =>
              address.id === updatedAddress.id ? updatedAddress : address
            );
          } else {
            return [...prevAddresses, updatedAddress];
          }
        });
      });
  }

  const form = getCustomerForm();

  useEffect(() => {
    form.reset({
      street: selectedAddress?.street || "",
      civic: selectedAddress?.civic || "",
      cap: selectedAddress?.cap?.toString() ?? "",
      name: customer?.name || "",
      surname: customer?.surname || "",
      floor: selectedAddress?.floor || "",
      stair: selectedAddress?.stair || "",
      street_info: selectedAddress?.street_info || "",
      notes: "",
      contact_phone: "",
      doorbell: "",
      when: "immediate",
    });
    form.clearErrors();
  }, [selectedAddress, customer]);

  // const getTitle = () => {
  //   if (!customer) {
  //     return "Nuovo domicilio";
  //   }
  //   return "Dati cliente";

  //   // switch (choice) {
  //   //   case AddressChoice.NORMAL:
  //   //     return "Dati cliente";
  //   //   case AddressChoice.NEW:
  //   //     return "Nuovo domicilio";
  //   //   case AddressChoice.TEMPORARY:
  //   //     return "Domicilio temporaneo";
  //   // }
  // };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full flex flex-col justify-between h-full"
        >
          {/* <h1 className="text-4xl w-full text-center">{getTitle()}</h1> */}

          <FormField control={form.control} name="street" label="Via" />

          <div className="flex justify-between gap-4">
            <FormField control={form.control} name="civic" label="Civico" />

            <FormField
              control={form.control}
              name="cap"
              label="CAP"
              type="number"
            />
          </div>

          <div className="flex justify-between gap-4">
            <FormField
              control={form.control}
              name="doorbell"
              label="Campanello"
            />
            <FormField
              control={form.control}
              name="contact_phone"
              label="Num. telefono addizionale"
            />
          </div>

          <div className="flex justify-between gap-4">
            <FormField
              control={form.control}
              name="name"
              label="Nome cliente"
            />
            <FormField
              control={form.control}
              name="surname"
              label="Cognome cliente"
            />
          </div>

          <FormField control={form.control} name="floor" label="Piano" />
          <FormField control={form.control} name="scala" label="Scala" />

          <div className="flex justify-between gap-4">
            <FormField
              control={form.control}
              name="street_info"
              label="Informazioni stradali"
            >
              <Textarea />
            </FormField>
            <FormField
              control={form.control}
              name="notes"
              label="Note sull'ordine"
            >
              <Textarea />
            </FormField>
          </div>

          <FormField control={form.control} name="when" label="Quando?">
            <WhenSelector className="h-10" isForm />
          </FormField>

          <Button type="submit">GO</Button>
        </form>
      </Form>
    </div>
  );
}
