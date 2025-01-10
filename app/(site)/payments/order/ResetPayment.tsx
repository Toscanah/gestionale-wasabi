import { Button } from "@/components/ui/button";
import { useOrderPaymentContext } from "../../context/OrderPaymentContext";

export default function ResetPayment() {
  const { resetPayment } = useOrderPaymentContext();

  return (
    <Button onClick={resetPayment} variant={"destructive"} className="text-lg w-[10%] h-16">
      Annulla
    </Button>
  );
}
