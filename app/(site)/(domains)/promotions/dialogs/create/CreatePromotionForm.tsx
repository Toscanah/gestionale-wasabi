import { PromotionType } from "@prisma/client";
import z from "zod";

export const CreatePromotionFormSchema = z.object({
  type: z.enum(PromotionType).default(PromotionType.FIXED_DISCOUNT),
  label: z.string().optional().nullable(),
  code: z.string().min(1, "Il codice è obbligatorio"),
  never_expires: z.boolean().default(false),
  expires_at: z.date().optional().nullable(),
  fixed_amount: z.coerce
    .number()
    .nonnegative("L'importo fisso deve essere positivo")
    .optional()
    .nullable(),
  percentage_value: z.coerce
    .number()
    .positive("La percentuale deve essere positiva")
    .max(100, "La percentuale non può superare 100")
    .optional()
    .nullable(),
  reusable: z.boolean().optional().nullable(),
  max_usages: z.coerce
    .number()
    .int()
    .positive("Il numero massimo di utilizzi deve essere positivo")
    .optional()
    .nullable(),
});

export type InputCreatePromotionFormSchema = z.input<typeof CreatePromotionFormSchema>;
export type OutputCreatePromotionFormSchema = z.output<typeof CreatePromotionFormSchema>;
export type CreatePromotionFormSchemaType = z.infer<typeof CreatePromotionFormSchema>;
