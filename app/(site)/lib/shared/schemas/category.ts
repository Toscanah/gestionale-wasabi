import { CategorySchema } from "@/prisma/generated/schemas";
import { CategoryWithOptionsSchema } from "../models/_index";
import { NoContentRequestSchema } from "./common/no-content";
import {
  ToggleDeleteEntityRequestSchema,
  ToggleEntityResponseSchema,
} from "./common/toggle-delete-entity";
import { createInputSchema, updateInputSchema, wrapSchema } from "./common/utils";
import { z } from "zod";

export namespace CategoryContracts {
  export namespace Common {
    export const Entity = CategoryWithOptionsSchema;
    export type Entity = z.infer<typeof Entity>;
  }

  export namespace Create {
    export const Input = wrapSchema(
      "category",
      createInputSchema(Common.Entity).partial({ options: true })
    );
    export type Input = z.infer<typeof Input>;

    export const Output = Common.Entity.nullable();
    export type Output = z.infer<typeof Output>;
  }

  export namespace Update {
    export const Input = wrapSchema("category", updateInputSchema(Common.Entity));
    export type Input = z.infer<typeof Input>;

    export const Output = Common.Entity;
    export type Output = Common.Entity;
  }

  export namespace Toggle {
    export const Input = ToggleDeleteEntityRequestSchema;
    export type Input = z.infer<typeof Input>;

    export const Output = ToggleEntityResponseSchema;
    export type Output = z.infer<typeof Output>;
  }

  export namespace GetAll {
    export const Input = NoContentRequestSchema;
    export type Input = z.infer<typeof Input>;

    export const Output = z.array(CategorySchema);
    export type Output = z.infer<typeof Output>;
  }
}
