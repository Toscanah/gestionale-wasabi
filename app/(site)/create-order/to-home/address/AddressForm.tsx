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
  setAddInfo,
  customer,
  selectedAddress,
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
}) {
  function onSubmit(values: FormValues) {
    const { name, surname, notes, contact_phone } = values;

    setAddInfo({
      notes: notes,
      when: "",
      contactPhone: contact_phone,
    });

    // fetch("api/addresses/", {
    //   method: "POST",
    //   body: JSON.stringify({
    //     requestType: true ? "create" : "update",
    //     content: {
    //       address: {
    //         customer_id: customer?.id,
    //         street: addressValues.street,
    //         civic: addressValues.civic,
    //         floor: addressValues.floor,
    //         cap: addressValues.cap,
    //         stair: addressValues.stair,
    //         street_info: addressValues.street_info,
    //         temporary: choice == AddressChoice.TEMPORARY ? true : false,
    //         id: address?.id,
    //       },
    //       phone: phone,
    //       customer: customer,
    //       name: name,
    //       surname: surname,
    //     },
    //   }),
    // })
    //   .then((response) => response.json())
    //   .then(
    //     (result: { customer: CustomerWithAddresses; address?: Address }) => {
    //       //console.log(result);

    //       if (result.customer) {
    //         setCustomer(result.customer);
    //       }
    //       setAddress(result.address);
    //     }
    //   );
  }

  const form = getCustomerForm(selectedAddress, customer);

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
    });
    form.clearErrors();
  }, [selectedAddress, customer]);

  const getTitle = () => {
    if (!customer) {
      return "Nuovo domicilio";
    }
    return "Dati cliente";

    // switch (choice) {
    //   case AddressChoice.NORMAL:
    //     return "Dati cliente";
    //   case AddressChoice.NEW:
    //     return "Nuovo domicilio";
    //   case AddressChoice.TEMPORARY:
    //     return "Domicilio temporaneo";
    // }
  };

  return (
    selectedAddress && (
      <div className="w-full h-full flex flex-col items-center justify-center">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full flex flex-col justify-between h-full"
          >
            {/* <h1 className="text-4xl w-full text-center">{getTitle()}</h1> */}

            <FormFieldWrapper
              control={form.control}
              name="street"
              label="Via"
            />

            <div className="flex justify-between gap-4">
              <FormFieldWrapper
                control={form.control}
                name="civic"
                label="Civico"
              />
              <FormFieldWrapper control={form.control} name="cap" label="CAP" />
            </div>

            <div className="flex justify-between gap-4">
              <FormFieldWrapper
                control={form.control}
                name="doorbell"
                label="Campanello"
              />
              <FormFieldWrapper
                control={form.control}
                name="contact_phone"
                label="Num. telefono addizionale"
              />
            </div>

            <div className="flex justify-between gap-4">
              <FormFieldWrapper
                control={form.control}
                name="name"
                label="Nome cliente"
              />
              <FormFieldWrapper
                control={form.control}
                name="surname"
                label="Cognome cliente"
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

            <Button type="submit">AAAAAAAAAAAAAAAAAAA</Button>
          </form>
        </Form>
      </div>
    )
  );
}
