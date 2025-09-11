import { z } from "zod";
import { NoContentRequestSchema } from "./common/no-content";

export namespace MetaContracts {
  export namespace GetTemplates {
    export const Input = NoContentRequestSchema;
    export type Input = z.infer<typeof Input>;
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
  }
}
