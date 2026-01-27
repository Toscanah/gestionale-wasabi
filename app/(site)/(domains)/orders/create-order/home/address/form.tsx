import { AddressContracts, CustomerContracts } from "@/lib/shared";
import { HomeOrderSchema } from "@/prisma/generated/schemas";
import { CustomerOrigin } from "@/prisma/generated/client/enums";
import { z } from "zod";

export const addressFormSchema = z.object({
  street: AddressContracts.Create.Input.shape.address.shape.street.default(""),
  doorbell: AddressContracts.Create.Input.shape.address.shape.doorbell.default(""),
  name: CustomerContracts.Create.Input.shape.customer.shape.name.optional().default(""),
  surname: CustomerContracts.Create.Input.shape.customer.shape.surname.optional().default(""),
  email: CustomerContracts.Create.Input.shape.customer.shape.email.optional().default(""),
  floor: AddressContracts.Create.Input.shape.address.shape.floor.optional().default(""),
  stair: AddressContracts.Create.Input.shape.address.shape.stair.optional().default(""),
  street_info: AddressContracts.Create.Input.shape.address.shape.street_info.optional().default(""),
  order_notes: CustomerContracts.Create.Input.shape.customer.shape.order_notes
    .optional()
    .default(""),
  contact_phone: HomeOrderSchema.shape.contact_phone.optional().default(""),
  preferences: CustomerContracts.Create.Input.shape.customer.shape.preferences
    .optional()
    .default(""),
  origin: CustomerContracts.Create.Input.shape.customer.shape.origin
    .optional()
    .default(CustomerOrigin.UNKNOWN),
});

export type AddressFormValues = z.infer<typeof addressFormSchema>;
