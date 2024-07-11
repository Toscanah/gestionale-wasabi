import { Address, Customer } from "@prisma/client";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import getCustomerForm, { FormValues } from "./getCustomerForm";
import { Textarea } from "@/components/ui/textarea";
import { AddressChoice } from "./AddressChoice";
import { CustomerWithAddresses } from "../../types/CustomerWithAddresses";

type FormFieldProps = {
  control: any;
  name: any;
  label: string;
  type?: "input" | "textarea";
};

function FormFieldWrapper({
  control,
  name,
  label,
  type = "input",
}: FormFieldProps) {
  const InputComponent = type === "input" ? Input : Textarea;

  return (
    <FormField
      control={control}
      name={name as any}
      render={({ field }) => (
        <FormItem className="w-full">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <InputComponent
              {...field}
              type={name == "cap" ? "number" : ""}
              className={type === "textarea" ? "resize-none" : ""}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default function AddressForm({
  address,
  customer,
  choice,
  phone,
  setAddress,
  setCustomer,
}: {
  choice: AddressChoice | undefined;
  address: Address | undefined;
  customer: Customer | undefined;
  phone: string;
  setAddress: Dispatch<SetStateAction<Address | undefined>>;
  setCustomer: Dispatch<SetStateAction<CustomerWithAddresses | undefined>>;
}) {
  if (!customer) {
    address = undefined;
  }

  function onSubmit(values: FormValues) {
    const { name, surname, notes, ...addressValues } = values;

    fetch("api/addresses/", {
      method: "POST",
      body: JSON.stringify({
        requestType: "create",
        content: {
          address: {
            customer_id: customer?.id,
            street: addressValues.street,
            civic: addressValues.civic,
            floor: addressValues.floor,
            cap: addressValues.cap,
            stair: addressValues.stair,
            street_info: addressValues.street_info,
            temporary: choice == AddressChoice.TEMPORARY ? true : false,
          },
          phone: phone,
          customer: customer,
          name: name,
          surname: surname,
        },
      }),
    })
      .then((response) => response.json())
      .then(
        (result: { customer: CustomerWithAddresses; address?: Address }) => {
          if (result.customer) {
            setCustomer(result.customer);
          }
          setAddress(result.address);
        }
      );
  }

  const form = getCustomerForm(address, customer);

  useEffect(() => {
    form.reset({
      street: address?.street || "",
      civic: address?.civic || "",
      cap: address?.cap?.toString() ?? "",
      name: customer?.name || "",
      surname: customer?.surname || "",
      floor: address?.floor || "",
      stair: address?.stair || "",
      street_info: address?.street_info || "",
      notes: "",
      contact_phone: "",
    });
    form.clearErrors();
  }, [address, customer, choice]);

  const getTitle = () => {
    if (!customer) {
      return "Nuovo domicilio";
    }

    switch (choice) {
      case AddressChoice.NORMAL:
        return "Dati cliente";
      case AddressChoice.NEW:
        return "Nuovo domicilio";
      case AddressChoice.TEMPORARY:
        return "Domicilio temporaneo";
    }
  };

  console.log(address)

  return (
    (choice || address) && (
      <div className="w-full h-full flex flex-col items-center justify-center">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full flex flex-col justify-between h-full"
          >
            <h1 className="text-4xl w-full text-center">{getTitle()}</h1>

            <FormFieldWrapper
              control={form.control}
              name="street"
              label="Via"
            />
            <FormFieldWrapper
              control={form.control}
              name="civic"
              label="Civico"
            />
            <FormFieldWrapper control={form.control} name="cap" label="CAP" />

            <FormFieldWrapper
              control={form.control}
              name="contact_phone"
              label="Num. telefono addizionale"
            />

            <div className="flex justify-between gap-4">
              <FormFieldWrapper
                control={form.control}
                name="name"
                label="Nome"
              />
              <FormFieldWrapper
                control={form.control}
                name="surname"
                label="Cognome"
              />
            </div>

            <FormFieldWrapper
              control={form.control}
              name="floor"
              label="Piano"
            />
            <FormFieldWrapper
              control={form.control}
              name="scala"
              label="Scala"
            />

            <div className="flex justify-between gap-4">
              <FormFieldWrapper
                control={form.control}
                name="street_info"
                label="Informazioni stradali"
                type="textarea"
              />
              <FormFieldWrapper
                control={form.control}
                name="notes"
                label="Note sull'ordine"
                type="textarea"
              />
            </div>

            <Button type="submit">
              {choice == AddressChoice.NORMAL ? "Aggiorna" : "Aggiungi"}
            </Button>
          </form>
        </Form>
      </div>
    )
  );
}
