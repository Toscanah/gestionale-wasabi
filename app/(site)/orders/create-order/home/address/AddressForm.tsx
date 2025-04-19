import { KeyboardEvent, RefObject, useEffect } from "react";
import { Form } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import FormField from "@/app/(site)/components/ui/FormField";
import getForm from "@/app/(site)/lib/util/getForm";
import formSchema from "./form";
import { useCreateHomeOrder } from "@/app/(site)/context/CreateHomeOrderContext";

interface AddressFormProps {
  formRef: RefObject<HTMLFormElement>;
  refs: RefObject<HTMLInputElement>[];
  handleKeyDown: (e: KeyboardEvent) => void;
}

export default function AddressForm({ formRef, refs, handleKeyDown }: AddressFormProps) {
  const { onSubmit, extraInfo, selectedAddress, customer, phone } = useCreateHomeOrder();
  const form = getForm(formSchema);

  const resetForm = () => {
    form.reset({
      street: !selectedAddress
        ? ""
        : selectedAddress?.street && selectedAddress?.civic
        ? `${selectedAddress.street} ${selectedAddress.civic}`
        : selectedAddress?.street,
      name: customer?.name || "",
      surname: customer?.surname || "",
      floor: selectedAddress?.floor || "",
      stair: selectedAddress?.stair || "",
      street_info: selectedAddress?.street_info || "",
      notes: extraInfo.notes,
      contact_phone: extraInfo.contactPhone,
      doorbell: selectedAddress?.doorbell || "",
      email: customer?.email || "",
      preferences: customer?.preferences || "",
    });

    form.clearErrors();
  };

  useEffect(resetForm, [selectedAddress, customer, phone]);

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
              ref={refs[4]}
              control={form.control}
              name="contact_phone"
              type="number"
              handleKeyDown={handleKeyDown}
              className="h-14 text-2xl uppercase"
              label="Num. telefono alternativo"
            />

            <FormField
              ref={refs[3]}
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
