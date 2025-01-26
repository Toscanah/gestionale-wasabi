import { RiceBatchLogSchema, RiceBatchSchema } from "@/prisma/generated/zod";
import { z } from "zod";

export const RiceBatchLogWithBatchSchema = RiceBatchLogSchema.extend({
  rice_batch: RiceBatchSchema,
});

export type RiceBatchLog = z.infer<typeof RiceBatchLogWithBatchSchema>;
