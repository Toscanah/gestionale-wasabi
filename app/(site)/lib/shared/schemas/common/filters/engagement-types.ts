import { z } from "zod";
import { EngagementType } from "@/prisma/generated/client/enums";

export const EngagementTypesFilterSchema = z.object({
  engagementTypes: z.array(z.enum(EngagementType)),
});

export type EngagementTypesFilter = z.infer<typeof EngagementTypesFilterSchema>;
