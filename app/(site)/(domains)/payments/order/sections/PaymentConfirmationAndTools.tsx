import Tools from "./Tools";
import { useOrderPaymentContext } from "@/context/OrderPaymentContext";
import PaymentConfirmation from "./PaymentConfirmation";
import roundToTwo from "@/lib/shared/utils/global/number/roundToTwo";

export default function PaymentConfirmationAndTools() {
  const { payment } = useOrderPaymentContext();

  return Math.abs(payment.remainingAmount) > 0.005 ? <Tools /> : <PaymentConfirmation />;
}
