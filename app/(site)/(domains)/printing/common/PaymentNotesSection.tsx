import sanitizeReceiptText from "@/lib/shared/utils/domains/printing/sanitazeReceiptText";
import { PlannedPayment } from "@/prisma/generated/client/enums";
import { Text } from "react-thermal-printer";
import { SMALL_PRINT } from "@/lib/shared/constants/printing";

interface PaymentNotesSectionProps {
  plannedPayment: PlannedPayment;
  prepaid: boolean;
}

export default function PaymentNotesSection({ plannedPayment, prepaid }: PaymentNotesSectionProps) {
  const finalNotes =
    plannedPayment === PlannedPayment.CASH ? "CONTANTI" : prepaid ? "GIA' PAGATO" : "CARTA";

  console.log(plannedPayment, prepaid, finalNotes);


  return (
    <>
      <Text bold inline size={SMALL_PRINT}>
        Note pagamento:{" "}
      </Text>
      <Text size={SMALL_PRINT}>{sanitizeReceiptText(finalNotes)}</Text>
    </>
  );
}
