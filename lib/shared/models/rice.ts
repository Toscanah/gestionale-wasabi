import { RiceLogSchema, RiceBatchSchema } from "@/prisma/generated/zod/schemas";
import { z } from "zod";

export const RiceBatchLogWithBatchSchema = RiceLogSchema.extend({
  rice_batch: RiceBatchSchema.nullable(),
});

export type RiceLog = z.infer<typeof RiceBatchLogWithBatchSchema>;
