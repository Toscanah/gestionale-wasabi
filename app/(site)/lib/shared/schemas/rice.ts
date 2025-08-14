import { z } from "zod";
import { NoContentSchema, ToggleDeleteObjectSchema, wrapSchema } from "./common";
import { RiceBatchSchema } from "@/prisma/generated/zod";
import { RiceLogType } from "@prisma/client";
import { ShiftType } from "../enums/Shift";
import { SchemaInputs } from "../types/SchemaInputs";

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

export const GetDailyRiceUsageSchema = z.object({
  shift: z.nativeEnum(ShiftType),
});

export const RICE_SCHEMAS = {
  getDailyRiceUsage: GetDailyRiceUsageSchema,
  getRiceBatches: NoContentSchema,
  addRiceBatch: AddRiceBatchSchema,
  deleteRiceBatch: ToggleDeleteObjectSchema,
  updateRiceBatch: UpdateRiceBatchSchema,
  getRiceLogs: NoContentSchema,
  addRiceLog: AddRiceLogSchema,
};

export type RiceSchemaInputs = SchemaInputs<typeof RICE_SCHEMAS>;
