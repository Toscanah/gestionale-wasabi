import { z } from "zod";
import { NoContentRequestSchema } from "./common/no-content";
import { ApiContract } from "../types/api-contract";

export const GetMetaTemplatesSchema = NoContentRequestSchema;

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

export const META_REQUESTS = {
  getMetaTemplates: GetMetaTemplatesSchema,
  sendMetaMessage: SendMetaMessageSchema,
};

export type MetaContract = ApiContract<typeof META_REQUESTS>;
