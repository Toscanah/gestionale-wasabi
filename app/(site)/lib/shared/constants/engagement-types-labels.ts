import { EngagementType } from "@/prisma/generated/client/enums";

export const ENGAGEMENT_TYPES_LABELS: Record<EngagementType, string> = {
  [EngagementType.QR_CODE]: "QR Code",
  [EngagementType.IMAGE]: "Immagine",
  [EngagementType.MESSAGE]: "Messaggio",
};
