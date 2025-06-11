import Tools from "./Tools";
import { useOrderPaymentContext } from "@/app/(site)/context/OrderPaymentContext";
import PaymentConfirmation from "./PaymentConfirmation";

export default function PaymentConfirmationAndTools() {
  const { payment } = useOrderPaymentContext();

  return payment.remainingAmount !== 0 ? <Tools /> : <PaymentConfirmation />;
}
