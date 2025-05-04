import { EngagementType } from "@prisma/client";

export default function getTemplateName(type: EngagementType) {
  switch (type) {
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
