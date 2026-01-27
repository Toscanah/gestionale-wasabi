import { OrderByType } from "@/lib/shared";
import { PlannedPayment } from "@/prisma/generated/client/enums";
import ExtraItemsSection from "../ExtraItemsSection";
import { Line, Text } from "react-thermal-printer";
import { SMALL_PRINT } from "@/lib/shared/constants/printing";
import sanitazeReceiptText from "@/lib/shared/utils/domains/printing/sanitazeReceiptText";
import PaymentNotesSection from "../PaymentNotesSection";

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
  const hasPreferences = preferences && preferences.trim().length > 0;
  const hasOrderNotes = orderNotes && orderNotes.trim().length > 0;
  const hasPaymentNotes = prepaid || (!prepaid && plannedPayment !== PlannedPayment.UNKNOWN);

  return (
    <>
      {putExtraItems && ExtraItemsSection({ order })}

      {hasPreferences && (
        <>
          <Text bold inline size={SMALL_PRINT}>
            Preferenze:{" "}
          </Text>
          <Text size={SMALL_PRINT}>{sanitazeReceiptText(preferences)}</Text>
        </>
      )}

      {hasOrderNotes && (
        <>
          <Text bold inline size={SMALL_PRINT}>
            Note ordine:{" "}
          </Text>
          <Text size={SMALL_PRINT}>{sanitazeReceiptText(orderNotes)}</Text>
        </>
      )}

      {hasPaymentNotes && PaymentNotesSection({ plannedPayment, prepaid })}

      {hasPreferences || hasOrderNotes || (hasPaymentNotes && <Line />)}
    </>
  );
}
