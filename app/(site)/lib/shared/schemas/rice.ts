import { z } from "zod";
import { RiceBatchSchema } from "@/prisma/generated/zod";
import { RiceLogType } from "@prisma/client";
import { ShiftFilterValue } from "../enums/shift";
import { NoContentRequestSchema } from "./common/no-content";
import { ToggleDeleteEntityRequestSchema } from "./common/toggle-delete-entity";
import { wrapSchema } from "./common/utils";

export namespace RiceContracts {
  export namespace AddBatch {
    export const Input = wrapSchema("batch", RiceBatchSchema.omit({ id: true }));
    export type Input = z.infer<typeof Input>;
  }

  export namespace UpdateBatch {
    export const Input = z.object({
      batchId: z.number(),
      field: z.enum(["amount", "label"]),
      value: z.any(),
    });
    export type Input = z.infer<typeof Input>;
  }

  export namespace AddLog {
    export const Input = z.object({
      riceBatchId: z.number().nullable(),
      manualValue: z.number().nullable(),
      type: z.enum(RiceLogType).nullable(),
    });
    export type Input = z.infer<typeof Input>;
  }

  export namespace GetDailyUsage {
    export const Input = z.object({
      shift: z.nativeEnum(ShiftFilterValue),
    });
    export type Input = z.infer<typeof Input>;
  }

  export namespace GetBatches {
    export const Input = NoContentRequestSchema;
    export type Input = z.infer<typeof Input>;
  }

  export namespace DeleteBatch {
    export const Input = ToggleDeleteEntityRequestSchema;
    export type Input = z.infer<typeof Input>;
  }

  export namespace GetLogs {
    export const Input = NoContentRequestSchema;
    export type Input = z.infer<typeof Input>;
  }
}
