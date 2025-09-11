import { AddressSchema } from "@/prisma/generated/zod";
import { z } from "zod";
import { createInputSchema, updateInputSchema, wrapSchema } from "./common/utils";

export namespace AddressContracts {
  export namespace Create {
    export const Input = wrapSchema("address", createInputSchema(AddressSchema));
    export type Input = z.infer<typeof Input>;
  }

  export namespace Update {
    export const Input = wrapSchema("address", updateInputSchema(AddressSchema));
    export type Input = z.infer<typeof Input>;
  }

  export namespace GetByCustomer {
    export const Input = wrapSchema("customerId", z.number());
    export type Input = z.infer<typeof Input>;
  }

  export namespace GetLastOfCustomer {
    export const Input = wrapSchema("phone", z.string());
    export type Input = z.infer<typeof Input>;
  }
}
