import { AnyOrder } from "@/app/(site)/lib/shared";
import { PlannedPayment } from "@prisma/client";
import ExtraItemsSection from "../ExtraItemsSection";
import { Text } from "react-thermal-printer";
import { SMALL_PRINT } from "../../constants";
import sanitazeReceiptText from "@/app/(site)/lib/formatting-parsing/printing/sanitazeReceiptText";
import PaymentNotesSection from "../PaymentNotesSection";
import fitReceiptText from "@/app/(site)/lib/formatting-parsing/printing/fitReceiptText";

interface CommonInfoProps {
  order: AnyOrder;
  plannedPayment: PlannedPayment;
  putExtraItems: boolean;
  preferences: string | undefined;
  orderNotes: string | undefined;
  prepaid: boolean;
}

export default function CommonInfo({
  order,
  plannedPayment,
  putExtraItems,
  preferences,
  orderNotes,
  prepaid,
}: CommonInfoProps) {
  return (
    <>
      {putExtraItems && ExtraItemsSection({ order })}

      {(preferences || orderNotes) && (
        <>
          {preferences && (
            <>
              <Text bold inline size={SMALL_PRINT}>
                Preferenze:{" "}
              </Text>
              <Text size={SMALL_PRINT}>{sanitazeReceiptText(preferences)}</Text>
            </>
          )}

          {orderNotes && (
            <>
              <Text bold inline size={SMALL_PRINT}>
                Note ordine:{" "}
              </Text>
              <Text size={SMALL_PRINT}>{fitReceiptText(sanitazeReceiptText(orderNotes), 40)}</Text>
            </>
          )}

          {plannedPayment !== PlannedPayment.UNKNOWN &&
            PaymentNotesSection({ plannedPayment, prepaid })}
        </>
      )}
    </>
  );
}
