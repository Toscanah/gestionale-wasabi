import { z } from "zod";
import {
  ButtonType,
  TemplateCategory,
  TemplateComponentType,
  TemplateFormat,
  TemplateLanguage,
  TemplateParameterFormat,
  TemplateStatus,
} from "../enums/Meta";

// BUTTONS

const QuickReplyButtonSchema = z.object({
  type: z.literal(ButtonType.QUICK_REPLY),
  text: z.string(),
});

const UrlButtonSchema = z.object({
  type: z.literal(ButtonType.URL),
  text: z.string(),
  url: z.string(),
  example: z.string().optional(),
});

export type UrlButton = z.infer<typeof UrlButtonSchema>;

const PhoneNumberButtonSchema = z.object({
  type: z.literal(ButtonType.PHONE_NUMBER),
  text: z.string(),
  phone_number: z.string(),
});

export const TemplateButtonSchema = z.union([
  QuickReplyButtonSchema,
  UrlButtonSchema,
  PhoneNumberButtonSchema,
]);

// HEADER

type HeaderMediaExampleFormat = Lowercase<TemplateFormat>;
type HeaderMediaExample<T extends HeaderMediaExampleFormat> = z.ZodObject<{
  [K in `header_${T}`]: z.ZodArray<z.ZodString>;
}>;

const HeaderMediaExampleSchema = <T extends HeaderMediaExampleFormat>(key: T) =>
  z.object({
    [`header_${key}`]: z.array(z.string()),
  }) as HeaderMediaExample<T>;

const TemplateHeaderTextSchema = z.object({
  type: z.literal(TemplateComponentType.HEADER),
  format: z.literal(TemplateFormat.TEXT),
  text: z.string(),
  example: HeaderMediaExampleSchema("text").optional(),
});

export type TemplateHeaderTextExample = z.infer<typeof TemplateHeaderTextSchema>["example"];

const TemplateHeaderImageSchema = z.object({
  type: z.literal(TemplateComponentType.HEADER),
  format: z.literal(TemplateFormat.IMAGE),
  example: HeaderMediaExampleSchema("image").optional(),
});

const TemplateHeaderDocumentSchema = z.object({
  type: z.literal(TemplateComponentType.HEADER),
  format: z.literal(TemplateFormat.DOCUMENT),
  example: HeaderMediaExampleSchema("document").optional(),
});

const TemplateHeaderVideoSchema = z.object({
  type: z.literal(TemplateComponentType.HEADER),
  format: z.literal(TemplateFormat.VIDEO),
  example: HeaderMediaExampleSchema("video").optional(),
});

const TemplateHeaderLocationSchema = z.object({
  type: z.literal(TemplateComponentType.HEADER),
  format: z.literal(TemplateFormat.LOCATION),
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

export type TemplateBodyExample = z.infer<typeof TemplateBodyExampleSchema>;

export const TemplateBodyComponentSchema = z.object({
  type: z.literal(TemplateComponentType.BODY),
  format: z.literal(TemplateFormat.TEXT),
  text: z.string(),
  example: TemplateBodyExampleSchema.optional(),
});

// FOOTER

export const TemplateFooterComponentSchema = z.object({
  type: z.literal(TemplateComponentType.FOOTER),
  format: z.literal(TemplateFormat.TEXT),
  text: z.string(),
  example: z.undefined().optional(),
});

// COMPONENTS

export const TemplateButtonsComponentSchema = z.object({
  type: z.literal(TemplateComponentType.BUTTONS),
  format: z.literal(TemplateFormat.TEXT),
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
  id: z.string(),
  parameter_format: z.literal(TemplateParameterFormat.POSITIONAL),
  status: z.nativeEnum(TemplateStatus),
  category: z.nativeEnum(TemplateCategory),
  language: z.nativeEnum(TemplateLanguage),
  components: z.array(TemplateComponentSchema),
});

export type TemplateButton = z.infer<typeof TemplateButtonSchema>;
export type TemplateComponent = z.infer<typeof TemplateComponentSchema>;
export type MetaTemplate = z.infer<typeof MetaTemplateSchema>;
