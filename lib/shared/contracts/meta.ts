import { z } from "zod";
import { NoContentRequestSchema } from "./common/no-content";
import { MetaTemplateSchema } from "../entities/Meta";
import { OrderByTypeSchema } from "../entities/Order";

export namespace MetaContracts {
  export namespace GetTemplates {
    export const Input = NoContentRequestSchema;
    export type Input = z.infer<typeof Input>;

    export const Output = z.array(MetaTemplateSchema);
    export type Output = z.infer<typeof Output>;
  }

  export namespace SendMessage {
    export const Input = z.object({
      template: z.object({
        name: z.string(),
        id: z.string(),
      }),
      orderId: z.number(),
      params: z.object({
        header_text: z.record(z.any(), z.any()).optional(),
        body_text: z.record(z.any(), z.any()).optional(),
        button_url: z.record(z.any(), z.any()).optional(),
      }),
    });
    export type Input = z.infer<typeof Input>;

    export const Output = OrderByTypeSchema;
    export type Output = z.infer<typeof Output>;
  }
}
