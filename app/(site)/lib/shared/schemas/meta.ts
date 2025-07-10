import { z } from "zod";
import { NoContentSchema } from "./common";

export const GetMetaTemplatesSchema = NoContentSchema;

export const SendMessageSchema = z.object({
  templateName: z.string(),
  params: z.array(z.string()),
  orderId: z.number(),
});

export const META_SCHEMAS = {
  getMetaTemplates: GetMetaTemplatesSchema,
  sendMessage: SendMessageSchema,
};
