import { z } from "zod";
import { RiceBatchSchema } from "@/prisma/generated/zod";
import { RiceLogType } from "@prisma/client";
import { ShiftFilterValue } from "../enums/shift";
import { NoContentRequestSchema } from "./common/no-content";
import { ToggleDeleteEntityRequestSchema } from "./common/toggle-delete-entity";
import { wrapSchema } from "./common/utils";
import { ApiContract } from "../types/api-contract";

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
  shift: z.nativeEnum(ShiftFilterValue),
});

export const RICE_REQUESTS = {
  getDailyRiceUsage: GetDailyRiceUsageSchema,
  getRiceBatches: NoContentRequestSchema,
  addRiceBatch: AddRiceBatchSchema,
  deleteRiceBatch: ToggleDeleteEntityRequestSchema,
  updateRiceBatch: UpdateRiceBatchSchema,
  getRiceLogs: NoContentRequestSchema,
  addRiceLog: AddRiceLogSchema,
};

export const RICE_RESPONSES = {};

export type RiceContract = ApiContract<typeof RICE_REQUESTS, typeof RICE_RESPONSES>;
