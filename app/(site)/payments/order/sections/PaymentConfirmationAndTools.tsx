import Tools from "./Tools";
import { useOrderPaymentContext } from "@/app/(site)/context/OrderPaymentContext";
import { AnyOrder } from "@/app/(site)/types/PrismaOrders";
import PaymentConfirmation from "./PaymentConfirmation";

export default function PaymentConfirmationAndTools({ order }: { order: AnyOrder }) {
  const { payment } = useOrderPaymentContext();

  return payment.remainingAmount > 0 ? <Tools /> : <PaymentConfirmation order={order} />;
}
