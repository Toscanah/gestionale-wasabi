import { z } from "zod";
import { NoContentSchema } from "./common";
import { SchemaInputs } from "../types/SchemaInputs";

export const GetMetaTemplatesSchema = NoContentSchema;

export const SendMetaMessageSchema = z.object({
  template: z.object({
    name: z.string(),
    id: z.string(),
  }),
  orderId: z.number(),
  params: z.object({
    header_text: z.record(z.string()).optional(),
    body_text: z.record(z.string()).optional(),
    button_url: z.record(z.string()).optional(),
  }),
});

export const META_SCHEMAS = {
  getMetaTemplates: GetMetaTemplatesSchema,
  sendMetaMessage: SendMetaMessageSchema,
};

export type MetaSchemaInputs = SchemaInputs<typeof META_SCHEMAS>;
