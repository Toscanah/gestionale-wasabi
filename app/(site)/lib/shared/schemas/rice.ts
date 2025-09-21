import { z } from "zod";
import { RiceBatchSchema, RiceLogSchema } from "@/prisma/generated/schemas";
import { RiceLogType } from "@prisma/client";
import { ShiftFilterValue } from "../enums/shift";
import { NoContentRequestSchema } from "./common/no-content";
import {
  ToggleDeleteEntityRequestSchema,
  ToggleEntityResponseSchema,
} from "./common/toggle-delete-entity";
import { wrapSchema } from "./common/utils";
import { RiceBatchLogWithBatchSchema } from "../models/rice";

export namespace RiceContracts {
  export namespace Common {
    export const Batch = RiceBatchSchema;
    export type Batch = z.infer<typeof Batch>;

    export const NoContentInput = NoContentRequestSchema;
    export type NoContentInput = z.infer<typeof NoContentInput>;
  }

  export namespace AddBatch {
    export const Input = wrapSchema("batch", Common.Batch.omit({ id: true }));
    export type Input = z.infer<typeof Input>;

    export const Output = Common.Batch;
    export type Output = Common.Batch;
  }

  export namespace UpdateBatch {
    export const Input = z.object({
      batchId: z.number(),
      field: z.enum(["amount", "label"]),
      value: z.any(),
    });
    export type Input = z.infer<typeof Input>;

    export const Output = Common.Batch;
    export type Output = Common.Batch;
  }

  export namespace AddLog {
    export const Input = z.object({
      riceBatchId: z.number().nullable(),
      manualValue: z.number().nullable(),
      type: z.enum(RiceLogType).nullable(),
    });
    export type Input = z.infer<typeof Input>;

    export const Output = RiceLogSchema;
    export type Output = z.infer<typeof Output>;
  }

  export namespace GetDailyUsage {
    export const Input = z.object({
      shift: z.enum(ShiftFilterValue),
    });
    export type Input = z.infer<typeof Input>;

    export const Output = z.object({
      dailyUsage: z.number(),
    });
    export type Output = z.infer<typeof Output>;
  }

  export namespace GetBatches {
    export const Input = Common.NoContentInput;
    export type Input = Common.NoContentInput;

    export const Output = z.array(Common.Batch);
    export type Output = z.infer<typeof Output>;
  }

  export namespace DeleteBatch {
    export const Input = ToggleDeleteEntityRequestSchema;
    export type Input = z.infer<typeof Input>;

    export const Output = ToggleEntityResponseSchema.omit({ active: true });
    export type Output = z.infer<typeof Output>;
  }

  export namespace GetLogs {
    export const Input = Common.NoContentInput;
    export type Input = Common.NoContentInput;

    export const Output = z.array(RiceBatchLogWithBatchSchema);
    export type Output = z.infer<typeof Output>;
  }
}
