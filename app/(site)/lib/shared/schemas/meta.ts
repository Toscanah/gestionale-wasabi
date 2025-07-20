import { z } from "zod";
import { NoContentSchema } from "./common";

export const GetMetaTemplatesSchema = NoContentSchema;

export const SendMessageSchema = z.object({
  template: z.object({
    name: z.string(),
    id: z.string(),
  }),
  orderId: z.number(),

  params: z.object({
    header_text: z.record(z.string()).optional(), // { "1": "Mario" }
    body_text: z.record(z.string()).optional(), // { "1": "ABC123", "2": "Napoli" }
    button_url: z.record(z.string()).optional(), // { "1": "https://..." }
  }),
});

export type SendMessageOptions = z.infer<typeof SendMessageSchema>;

export const META_SCHEMAS = {
  getMetaTemplates: GetMetaTemplatesSchema,
  sendMessage: SendMessageSchema,
};
