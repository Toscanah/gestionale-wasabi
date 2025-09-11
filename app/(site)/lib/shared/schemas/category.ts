import { CategorySchema } from "@/prisma/generated/zod";
import { CategoryWithOptionsSchema } from "../models/_index";
import { NoContentRequestSchema } from "./common/no-content";
import { ToggleDeleteEntityRequestSchema } from "./common/toggle-delete-entity";
import { createInputSchema, updateInputSchema } from "./common/utils";
import { z } from "zod";

export namespace CategoryContracts {
  export namespace Create {
    export const Input = createInputSchema(CategoryWithOptionsSchema).partial({
      options: true,
    });
    export type Input = z.infer<typeof Input>;
  }

  export namespace Update {
    export const Input = updateInputSchema(CategoryWithOptionsSchema);
    export type Input = z.infer<typeof Input>;
  }

  export namespace Toggle {
    export const Input = ToggleDeleteEntityRequestSchema;
    export type Input = z.infer<typeof Input>;
  }

  export namespace GetAll {
    export const Input = NoContentRequestSchema;
    export type Input = z.infer<typeof Input>;

    export const Output = z.array(CategorySchema);
    export type Output = z.infer<typeof Output>;
  }
}
