import { Button } from "@/components/ui/button";
import { PaymentType } from "@prisma/client";
import print from "../../printing/print";
import PaymentSummaryReceipt from "../../printing/receipts/PaymentSummaryReceipt";
import { PaymentsSummaryData } from "../../hooks/usePaymentsHistory";

interface PrintSummaryProps {
  summaryData: PaymentsSummaryData;

  firstOrderDate?: Date;
}

export default function PrintSummary({ summaryData, firstOrderDate }: PrintSummaryProps) {
  const isButtonDisabled = Object.values(summaryData.totals).every(({ total }) => total === 0);

  return (
    <Button
      className="mt-auto"
      onClick={async () =>
        await print(() =>
          PaymentSummaryReceipt({
            summaryData,
            date: new Date(firstOrderDate || new Date()),
          })
        )
      }
      disabled={isButtonDisabled}
    >
      Stampa riassunto
    </Button>
  );
}
