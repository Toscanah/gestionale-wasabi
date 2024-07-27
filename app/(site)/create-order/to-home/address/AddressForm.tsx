import { Address, Customer } from "@prisma/client";
import { Dispatch, SetStateAction, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import getCustomerForm, {
  FormValues,
} from "../../../components/forms/getCustomerForm";
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
      stair: values.stair,
      street_info: values.street_info,
      temporary: highlight === "temp",
      id: selectedAddress?.id,
    };

    fetchRequest<Customer>(
      "POST",
      "/api/customers/",
      actionCustomer === "create" ? "createCustomer" : "updateCustomer",
      actionCustomer === "create"
        ? { phone, customer: customerContent }
        : customerContent
    )
      .then((updatedCustomer) => {
        setCustomer(updatedCustomer);

        return fetchRequest<Address>(
          "POST",
          "/api/addresses/",
          actionAddress === "create" ? "createAddress" : "updateAddress",
          addressContent
        );
      })
      .then((updatedAddress) => {
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
      name: customer?.name || "",
      surname: customer?.surname || "",
      floor: selectedAddress?.floor || "",
      stair: selectedAddress?.stair || "",
      street_info: selectedAddress?.street_info || "",
      notes: "",
      contact_phone: "",
      doorbell: selectedAddress?.doorbell || "",
      when: "immediate",
      // TODO: prendere le preferenze dal cliente  preferences: customer.preferences || "",
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

          <FormField
            control={form.control}
            name="street"
            label="Via"
            className="h-14 text-2xl"
            example="(es. Via dei Giacinti 41) "
          />

          <div className="flex justify-between gap-4">
            <FormField
              control={form.control}
              name="doorbell"
              className="h-14 text-2xl"
              label="Campanello"
              example="(es. Rossi)"
            />
            <FormField
              control={form.control}
              name="contact_phone"
              className="h-14 text-2xl"
              label="Num. telefono addizionale"
            />
          </div>

          <div className="flex justify-between gap-4">
            <FormField
              control={form.control}
              name="floor"
              label="Piano"
              className="h-14 text-2xl"
            />
            <FormField
              control={form.control}
              name="scala"
              label="Scala"
              className="h-14 text-2xl"
              example="(dx / sx)"
            />
          </div>

          <div className="flex justify-between gap-4">
            <FormField
              control={form.control}
              name="name"
              label="Nome"
              className="h-14 text-2xl"
            />
            <FormField
              control={form.control}
              name="surname"
              label="Cognome"
              className="h-14 text-2xl"
            />
          </div>

          <div className="flex justify-between gap-4">
            <FormField
              control={form.control}
              name="street_info"
              label="Informazioni stradali"
              example="(es. Arrivare da Via Udine..)"
            >
              <Textarea className="resize-none text-xl" />
            </FormField>

            <FormField
              control={form.control}
              name="notes"
              label="Note sull'ordine"
              example="(es. Extra wasabi, no zenzero)"
            >
              <Textarea className="resize-none text-xl" />
            </FormField>

            <FormField
              control={form.control}
              name="preferences"
              label="Preferenze cliente"
              example="(es. Intollerante, coca zero)"
            >
              <Textarea className="resize-none text-xl" />
            </FormField>
          </div>

          <FormField control={form.control} name="when" label="Quando?">
            <WhenSelector isForm className="h-14 text-2xl" />
          </FormField>

          <Button type="submit">GO</Button>
        </form>
      </Form>
    </div>
  );
}
