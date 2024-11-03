import { PaymentType } from "@prisma/client";

export default function getPaymentName(type: PaymentType) {
  switch (type) {
    case PaymentType.CARD:
      return "la carta";
    case PaymentType.CASH:
      return "contanti";
    case PaymentType.CREDIT:
      return "i crediti";
    case PaymentType.VOUCH:
      return "i buoni pasto";
    default:
      return "";
  }
};