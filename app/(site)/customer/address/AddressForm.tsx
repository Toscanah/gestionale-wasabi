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
import { AddressChoice, AddressChoiceType } from "../AddressChoice";

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
        <FormItem className="flex-1">
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
  setAddress,
}: {
  choice: AddressChoiceType;
  address: Address | undefined;
  customer: Customer;
  setAddress: Dispatch<SetStateAction<Address | undefined>>;
}) {
  function onSubmit(values: FormValues) {
    const { name, surname, notes, ...addressValues } = values;

    fetch("api/addresses/", {
      method: "POST",
      body: JSON.stringify({
        requestType: "create",
        content: {
          customer_id: customer.id,
          ...addressValues,
          temporary: choice == AddressChoice.TEMPORARY ? true : false,
        },
      }),
    })
      .then((response) => response.json())
      .then((address) => {
        setAddress(address);
      });
  }

  const form = getCustomerForm(address, customer);

  useEffect(() => {
    form.reset({
      street: address?.street || "",
      civic: address?.civic || "",
      cap: address?.cap ?? undefined,
      name: customer?.name || "",
      surname: customer?.surname || "",
      floor: address?.floor || "",
      stair: address?.stair || "",
      street_info: address?.street_info || "",
      notes: "",
    });
  }, [address]);

  const getTitle = () => {
    return "Dati";
    // TODO:
    // switch (addressChoice) {
    //   case "normal":
    //     return "Dati cliente";
    //   case "new":
    //     return "Nuovo domicilio";
    //   case "temp":
    //     return "Domicilio temporaneo";
    // }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full flex flex-col space-y-7"
        >
          <h1 className="text-4xl w-full text-center">{getTitle()}</h1>
          <div className="flex justify-between gap-4">
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
          </div>

          <div className="flex justify-between gap-4">
            <FormFieldWrapper control={form.control} name="name" label="Nome" />
            <FormFieldWrapper
              control={form.control}
              name="surname"
              label="Cognome"
            />
          </div>

          <div className="flex justify-between gap-4">
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
          </div>

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

          <Button type="submit">Modifica</Button>
        </form>
      </Form>
    </div>
  );
}
