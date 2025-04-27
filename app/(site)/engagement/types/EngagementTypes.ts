import { EngagementType } from "@prisma/client";

export const ENGAGEMENT_TYPES = [
  { value: EngagementType.QR_CODE, label: "QR Code" },
  { value: EngagementType.IMAGE, label: "Immagine" },
  { value: EngagementType.MESSAGE, label: "Messaggio" },
];
