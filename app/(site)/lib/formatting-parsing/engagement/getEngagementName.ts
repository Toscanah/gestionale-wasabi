import { Engagement, EngagementType } from "@prisma/client";

export default function getEngagementName(engagement: Engagement) {
  switch (engagement.type) {
    case EngagementType.IMAGE:
      return "Immagine";
    case EngagementType.QR_CODE:
      return "QR Code";
    case EngagementType.MESSAGE:
      return "Messaggio";
    default:
      return "Tipo sconosciuto";
  }
}
