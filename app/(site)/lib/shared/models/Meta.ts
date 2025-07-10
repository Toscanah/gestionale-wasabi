import { z } from "zod";

// BUTTONS

const QuickReplyButtonSchema = z.object({
  type: z.literal("QUICK_REPLY"),
  text: z.string(),
});

const UrlButtonSchema = z.object({
  type: z.literal("URL"),
  text: z.string(),
  url: z.string(),
  example: z.string().optional(),
});

const PhoneNumberButtonSchema = z.object({
  type: z.literal("PHONE_NUMBER"),
  text: z.string(),
  phone_number: z.string(),
});

export const TemplateButtonSchema = z.union([
  QuickReplyButtonSchema,
  UrlButtonSchema,
  PhoneNumberButtonSchema,
]);

// HEADER

const HeaderTextExampleSchema = z.object({
  header_text: z.array(z.string()),
});

const HeaderMediaExampleSchema = <T extends "image" | "video" | "document">(key: T) =>
  z.object({
    ["header_" + key]: z.array(z.string()),
  } as Record<T, z.ZodArray<z.ZodString>>); // typed key return

const TemplateHeaderTextSchema = z.object({
  type: z.literal("HEADER"),
  format: z.literal("TEXT"),
  text: z.string(),
  example: HeaderTextExampleSchema.optional(),
});

const TemplateHeaderImageSchema = z.object({
  type: z.literal("HEADER"),
  format: z.literal("IMAGE"),
  example: HeaderMediaExampleSchema("image").optional(),
});

const TemplateHeaderDocumentSchema = z.object({
  type: z.literal("HEADER"),
  format: z.literal("DOCUMENT"),
  example: HeaderMediaExampleSchema("document").optional(),
});

const TemplateHeaderVideoSchema = z.object({
  type: z.literal("HEADER"),
  format: z.literal("VIDEO"),
  example: HeaderMediaExampleSchema("video").optional(),
});

const TemplateHeaderLocationSchema = z.object({
  type: z.literal("HEADER"),
  format: z.literal("LOCATION"),
  example: z.undefined().optional(),
});

export const TemplateHeaderComponentSchema = z.union([
  TemplateHeaderTextSchema,
  TemplateHeaderImageSchema,
  TemplateHeaderDocumentSchema,
  TemplateHeaderVideoSchema,
  TemplateHeaderLocationSchema,
]);

// BODY

const TemplateBodyExampleSchema = z.object({
  body_text: z.array(z.array(z.string())),
});

export const TemplateBodyComponentSchema = z.object({
  type: z.literal("BODY"),
  format: z.literal("TEXT"),
  text: z.string(),
  example: TemplateBodyExampleSchema.optional(),
});

// FOOTER

export const TemplateFooterComponentSchema = z.object({
  type: z.literal("FOOTER"),
  format: z.literal("TEXT"),
  text: z.string(),
  example: z.undefined().optional(),
});

// COMPONENTS

export const TemplateButtonsComponentSchema = z.object({
  type: z.literal("BUTTONS"),
  format: z.literal("TEXT"),
  buttons: z.array(TemplateButtonSchema),
  example: z.undefined().optional(),
});

export const TemplateComponentSchema = z.union([
  TemplateBodyComponentSchema,
  TemplateHeaderComponentSchema,
  TemplateFooterComponentSchema,
  TemplateButtonsComponentSchema,
]);

// FINAL

export const MetaTemplateSchema = z.object({
  name: z.string(),
  category: z.enum(["AUTHENTICATION", "MARKETING", "UTILITY"]),
  language: z.union([z.literal("it_IT"), z.literal("en_US"), z.string()]),
  components: z.array(TemplateComponentSchema),
});

export type TemplateButton = z.infer<typeof TemplateButtonSchema>;
export type TemplateComponent = z.infer<typeof TemplateComponentSchema>;
export type MetaTemplate = z.infer<typeof MetaTemplateSchema>;
