import { EngagementType } from "@/prisma/generated/client/enums";

export const ENGAGEMENT_TYPES_LABELS: Record<EngagementType, string> = {
  [EngagementType.QR_CODE]: "QR Code",
  [EngagementType.IMAGE]: "Immagine",
  [EngagementType.MESSAGE]: "Messaggio",
};

export const ENGAGEMENT_TYPES_COLORS: Record<EngagementType, string> = {
  [EngagementType.QR_CODE]:
    "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700",
  [EngagementType.IMAGE]:
    "bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900 dark:text-purple-200 dark:border-purple-700",
  [EngagementType.MESSAGE]:
    "bg-green-100 text-green-800 border-green-300 dark:bg-green-900 dark:text-green-200 dark:border-green-700",
};
