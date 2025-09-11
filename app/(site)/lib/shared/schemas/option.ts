import { CategorySchema, OptionSchema } from "@/prisma/generated/zod";
import { z } from "zod";
import { createInputSchema, updateInputSchema, wrapSchema } from "./common/utils";
import { NoContentRequestSchema } from "./common/no-content";
import { ToggleDeleteEntityRequestSchema } from "./common/toggle-delete-entity";

export namespace OptionContracts {
  export namespace GetAll {
    export const Input = NoContentRequestSchema;
    export type Input = z.infer<typeof Input>;
  }

  export namespace GetAllWithCategories {
    export const Input = NoContentRequestSchema;
    export type Input = z.infer<typeof Input>;
  }

  export namespace UpdateOptionsOfCategory {
    export const Input = z.object({
      category: CategorySchema,
      options: z.array(OptionSchema),
    });
    export type Input = z.infer<typeof Input>;
  }

  export namespace Update {
    export const Input = wrapSchema("option", updateInputSchema(OptionSchema));
    export type Input = z.infer<typeof Input>;
  }

  export namespace Create {
    export const Input = wrapSchema("option", createInputSchema(OptionSchema));
    export type Input = z.infer<typeof Input>;
  }

  export namespace Toggle {
    export const Input = ToggleDeleteEntityRequestSchema;
    export type Input = z.infer<typeof Input>;
  }
}