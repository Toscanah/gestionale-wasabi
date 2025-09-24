import { OrderByType } from "@/app/(site)/lib/shared";
import { PlannedPayment } from "@prisma/client";
import ExtraItemsSection from "../ExtraItemsSection";
import { Line, Text } from "react-thermal-printer";
import { SMALL_PRINT } from "../../constants";
import sanitazeReceiptText from "@/app/(site)/lib/utils/domains/printing/sanitazeReceiptText";
import PaymentNotesSection from "../PaymentNotesSection";
import fitReceiptText from "@/app/(site)/lib/utils/domains/printing/fitReceiptText";

interface CommonInfoProps {
  order: OrderByType;
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
              <Text size={SMALL_PRINT}>{fitReceiptText(sanitazeReceiptText(orderNotes), 35)}</Text>
            </>
          )}

          {(prepaid || (!prepaid && plannedPayment !== PlannedPayment.UNKNOWN)) &&
            PaymentNotesSection({ plannedPayment, prepaid })}

          <Line />
        </>
      )}
    </>
  );
}
