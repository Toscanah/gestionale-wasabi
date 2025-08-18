import Tools from "./Tools";
import { useOrderPaymentContext } from "@/app/(site)/context/OrderPaymentContext";
import PaymentConfirmation from "./PaymentConfirmation";
import roundToTwo from "@/app/(site)/lib/utils/global/number/roundToTwo";

export default function PaymentConfirmationAndTools() {
  const { payment } = useOrderPaymentContext();

  return Math.abs(payment.remainingAmount) > 0.005 ? <Tools /> : <PaymentConfirmation />;
}
