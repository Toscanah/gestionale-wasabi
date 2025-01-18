import { Button } from "@/components/ui/button";
import { useOrderPaymentContext } from "../../context/OrderPaymentContext";

export default function ResetPayment() {
  const { resetPayment } = useOrderPaymentContext();

  return (
    <Button onClick={resetPayment} variant={"destructive"} className="text-2xl w-[30%] h-16">
      Cancella
    </Button>
  );
}
