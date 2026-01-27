import { AddressSchema } from "@/prisma/generated/schemas";
import { z } from "zod";
import { createInputSchema, updateInputSchema, wrapSchema } from "./common/utils";

export namespace AddressContracts {
  export namespace Common {
    export const Entity = AddressSchema;
    export type Entity = z.infer<typeof Entity>;
  }

  export namespace Toggle {
    export const Input = z.object({
      id: z.number(),
      active: z.boolean(),
    });
    export type Input = z.infer<typeof Input>;

    export const Output = Common.Entity;
    export type Output = z.infer<typeof Output>;
  }

  export namespace Create {
    export const Input = wrapSchema("address", createInputSchema(Common.Entity));
    export type Input = z.infer<typeof Input>;

    export const Output = Common.Entity;
    export type Output = Common.Entity;
  }

  export namespace Update {
    export const Input = z.object({
      address: Common.Entity.partial(),
    });
    export type Input = z.infer<typeof Input>;

    export const Output = Common.Entity;
    export type Output = Common.Entity;
  }

  export namespace GetByCustomer {
    export const Input = wrapSchema("customerId", z.number());
    export type Input = z.infer<typeof Input>;

    export const Output = z.array(Common.Entity);
    export type Output = z.infer<typeof Output>;
  }

  export namespace GetLastIdOfCustomer {
    export const Input = wrapSchema("phone", z.string());
    export type Input = z.infer<typeof Input>;

    export const Output = z.number().nullable();
    export type Output = z.infer<typeof Output>;
  }
}
