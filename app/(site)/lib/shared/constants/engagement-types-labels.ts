import { EngagementType } from "@prisma/client";

export const ENGAGEMENT_TYPES_LABELS: Record<EngagementType, string> = {
  [EngagementType.QR_CODE]: "QR Code",
  [EngagementType.IMAGE]: "Immagine",
  [EngagementType.MESSAGE]: "Messaggio",
};
