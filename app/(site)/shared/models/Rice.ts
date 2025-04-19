import { RiceLogSchema, RiceBatchSchema } from "@/prisma/generated/zod";
import { z } from "zod";

export const RiceBatchLogWithBatchSchema = RiceLogSchema.extend({
  rice_batch: RiceBatchSchema,
});

export type RiceLog = z.infer<typeof RiceBatchLogWithBatchSchema>;
