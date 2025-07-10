import { z } from "zod";
import { NoContentSchema, ToggleDeleteObjectSchema, wrapSchema } from "./common";
import { RiceBatchSchema } from "@/prisma/generated/zod";
import { RiceLogType } from "@prisma/client";

export const AddRiceBatchSchema = wrapSchema("batch", RiceBatchSchema.omit({ id: true }));

export const UpdateRiceBatchSchema = z.object({
  batchId: z.number(),
  field: z.enum(["amount", "label"]),
  value: z.any(),
});

export const AddRiceLogSchema = z.object({
  riceBatchId: z.number().nullable(),
  manualValue: z.number().nullable(),
  type: z.nativeEnum(RiceLogType).nullable(),
});

export const RICE_SCHEMAS = {
  getDailyRiceUsage: NoContentSchema,
  getRiceBatches: NoContentSchema,
  addRiceBatch: AddRiceBatchSchema,
  deleteRiceBatch: ToggleDeleteObjectSchema,
  updateRiceBatch: UpdateRiceBatchSchema,
  getRiceLogs: NoContentSchema,
  addRiceLog: AddRiceLogSchema,
};
