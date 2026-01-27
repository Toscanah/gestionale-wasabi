import { CategorySchema, OptionSchema } from "@/prisma/generated/schemas";
import { z } from "zod";
import { createInputSchema, updateInputSchema, wrapSchema } from "./common/utils";
import { NoContentRequestSchema } from "./common/no-content";
import { OptionWithCategoriesSchema } from "../entities/Option";
import {
  ToggleDeleteEntityRequestSchema,
  ToggleEntityResponseSchema,
} from "./common/toggle-delete-entity";

export namespace OptionContracts {
  export namespace Common {
    export const NoContentInput = NoContentRequestSchema;
    export type NoContentInput = z.infer<typeof NoContentInput>;

    export const WithCategories = OptionWithCategoriesSchema;
    export type WithCategories = z.infer<typeof WithCategories>;
  }

  export namespace GetAll {
    export const Input = Common.NoContentInput;
    export type Input = Common.NoContentInput;

    export const Output = z.array(OptionSchema);
    export type Output = z.infer<typeof Output>;
  }

  export namespace GetAllWithCategories {
    export const Input = Common.NoContentInput;
    export type Input = Common.NoContentInput;

    export const Output = z.array(Common.WithCategories);
    export type Output = z.infer<typeof Output>;
  }

  export namespace UpdateOptionsOfCategory {
    export const Input = z.object({
      category: CategorySchema,
      options: z.array(OptionSchema),
    });
    export type Input = z.infer<typeof Input>;

    export const Output = z.object({
      added: z.array(z.number()),
      removed: z.array(z.number()),
    });
    export type Output = z.infer<typeof Output>;
  }

  export namespace Update {
    export const Input = wrapSchema("option", updateInputSchema(OptionSchema));
    export type Input = z.infer<typeof Input>;

    export const Output = Common.WithCategories;
    export type Output = Common.WithCategories;
  }

  export namespace Create {
    export const Input = z.object({
      option: createInputSchema(OptionSchema),
    });
    export type Input = z.infer<typeof Input>;

    export const Output = Common.WithCategories;
    export type Output = Common.WithCategories;
  }

  export namespace Toggle {
    export const Input = ToggleDeleteEntityRequestSchema;
    export type Input = z.infer<typeof Input>;

    export const Output = ToggleEntityResponseSchema;
    export type Output = z.infer<typeof Output>;
  }
}
