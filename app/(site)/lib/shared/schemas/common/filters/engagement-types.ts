import { z } from "zod";
import { EngagementType } from "@prisma/client";

export const EngagementTypesFilterSchema = z.object({
  engagementTypes: z.array(z.enum(EngagementType)),
});

export type EngagementTypesFilter = z.infer<typeof EngagementTypesFilterSchema>;
