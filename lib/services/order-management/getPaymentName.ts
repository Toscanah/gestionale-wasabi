import { PaymentType } from "@/prisma/generated/client/enums";

export default function getPaymentName(type: PaymentType) {
  switch (type) {
    case PaymentType.CARD:
      return "Carta";
    case PaymentType.CASH:
      return "Contanti";
    case PaymentType.CREDIT:
      return "Crediti";
    case PaymentType.VOUCH:
      return "Buoni pasto";
    default:
      return "";
  }
}
