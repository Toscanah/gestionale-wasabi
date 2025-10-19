import { KeyboardEvent, RefCallback, RefObject, useEffect } from "react";
import { Form, FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useCreateHomeOrder } from "@/app/(site)/context/CreateHomeOrderContext";
import { CustomerOrigin } from "@prisma/client";
import { FormField as RawFormField } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CUSTOMER_ORIGIN_LABELS } from "@/app/(site)/lib/shared";
import { addressFormSchema } from "./form";
import { WasabiFormField } from "@/app/(site)/components/ui/wasabi/WasabiFormField";
import { useZodForm } from "@/app/(site)/hooks/useZodForm";

interface AddressFormProps {
  formRef: RefObject<HTMLFormElement | null>;
  refs: {
    street: RefObject<HTMLInputElement | null>;
    doorbell: RefObject<HTMLInputElement | null>;
    floor: RefObject<HTMLInputElement | null>;
    stair: RefObject<HTMLInputElement | null>;
    contact_phone: RefObject<HTMLInputElement | null>;
    name: RefObject<HTMLInputElement | null>;
    surname: RefObject<HTMLInputElement | null>;
    email: RefObject<HTMLInputElement | null>;
    street_info: RefObject<HTMLInputElement | null>;
    order_notes: RefObject<HTMLInputElement | null>;
    preferences: RefObject<HTMLInputElement | null>;
  };
  handleKeyDown: (e: KeyboardEvent) => void;
}

export default function AddressForm({ formRef, refs, handleKeyDown }: AddressFormProps) {
  const { onSubmit, extraInfo, selectedAddress, customer, phone } = useCreateHomeOrder();

  const form = useZodForm({
    schema: addressFormSchema,
    defaultValues: addressFormSchema.parse({}),
  });

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
      order_notes: customer?.order_notes || "",
      contact_phone: extraInfo.contactPhone,
      doorbell: selectedAddress?.doorbell || "",
      email: customer?.email || "",
      preferences: customer?.preferences || "",
      origin: (customer?.origin as CustomerOrigin) || CustomerOrigin.UNKNOWN,
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
          <RawFormField
            control={form.control}
            name="origin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Origine cliente</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="w-full flex gap-8 items-center"
                  >
                    {Object.entries(CUSTOMER_ORIGIN_LABELS).map(([value, label]) => (
                      <FormItem key={value} className="flex items-center gap-2">
                        <FormControl>
                          <RadioGroupItem className="h-5 w-5" value={value as CustomerOrigin} />
                        </FormControl>
                        <FormLabel className="!mt-0 text-2xl">{label}</FormLabel>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <WasabiFormField
            control={form.control}
            name="street"
            ref={refs.street}
            label="Via"
            onKeyDown={handleKeyDown}
            className="w-full h-14 !text-2xl uppercase"
            // description="(es. Via dei Giacinti 41)"
          />

          <div className="w-full flex gap-4">
            <WasabiFormField
              ref={refs.doorbell}
              control={form.control}
              name="doorbell"
              onKeyDown={handleKeyDown}
              className="w-full h-14 !text-2xl uppercase"
              label="Campanello"
              // description="(es. Rossi)"
            />

            <WasabiFormField
              ref={refs.floor}
              control={form.control}
              name="floor"
              label="Piano"
              onKeyDown={handleKeyDown}
              className="w-full h-14 !text-2xl uppercase"
            />
          </div>

          <div className="w-full flex gap-4">
            <WasabiFormField
              ref={refs.contact_phone}
              control={form.control}
              name="contact_phone"
              type="number"
              onKeyDown={handleKeyDown}
              className="w-full h-14 !text-2xl uppercase"
              label="Num. telefono alternativo"
            />

            <WasabiFormField
              ref={refs.stair}
              control={form.control}
              name="stair"
              label="Scala"
              onKeyDown={handleKeyDown}
              className="w-full h-14 !text-2xl uppercase"
              // description="(dx / sx)"
            />
          </div>

          <div className="w-full flex gap-4">
            <WasabiFormField
              control={form.control}
              name="name"
              ref={refs.name}
              label="Nome"
              onKeyDown={handleKeyDown}
              className="w-full h-14 !text-2xl uppercase"
            />

            <WasabiFormField
              control={form.control}
              name="surname"
              ref={refs.surname}
              onKeyDown={handleKeyDown}
              label="Cognome"
              className="w-full h-14 !text-2xl uppercase"
            />
          </div>

          <WasabiFormField
            control={form.control}
            name="email"
            label="Email"
            ref={refs.email}
            onKeyDown={handleKeyDown}
            className="w-full h-14 !text-2xl uppercase"
            // description="(es. mario.rossi@gmail.com)"
          />

          <div className="w-full flex gap-4">
            <WasabiFormField
              control={form.control}
              name="street_info"
              onKeyDown={handleKeyDown}
              label="Informazioni stradali"
              // description="(es. Arrivare da Via Udine..)"
              render={({ value, onChange, ref }) => (
                <Textarea
                  ref={refs.street_info as any}
                  value={value?.toString() || ""}
                  onChange={onChange}
                  className="w-full resize-none !text-xl uppercase"
                />
              )}
            />

            <WasabiFormField
              control={form.control}
              name="order_notes"
              onKeyDown={handleKeyDown}
              label="Note sull'ordine"
              // description="(es. Extra wasabi, no zenzero)"
              render={({ value, onChange, ref }) => (
                <Textarea
                  ref={refs.order_notes as any}
                  value={value?.toString() || ""}
                  onChange={onChange}
                  className="w-full resize-none !text-xl uppercase"
                />
              )}
            />

            <WasabiFormField
              control={form.control}
              name="preferences"
              onKeyDown={handleKeyDown}
              label="Preferenze cliente"
              // description="(es. Intollerante, coca zero)"
              render={({ value, onChange, ref }) => (
                <Textarea
                  ref={refs.preferences as any}
                  value={value || ""}
                  onChange={onChange}
                  className="w-full resize-none !text-xl uppercase"
                />
              )}
            />
          </div>
        </form>
      </Form>
    </div>
  );
}
