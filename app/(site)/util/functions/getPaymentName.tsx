import { TYPE_OF_PAYMENT } from "../../payments/order/OrderPayment";

export default function getPaymentName(type: TYPE_OF_PAYMENT) {
  switch (type) {
    case TYPE_OF_PAYMENT.CARD:
      return "la carta";
    case TYPE_OF_PAYMENT.CASH:
      return "contanti";
    case TYPE_OF_PAYMENT.CREDIT:
      return "i crediti";
    case TYPE_OF_PAYMENT.VOUCH:
      return "i buoni pasto";
    default:
      return "";
  }
};