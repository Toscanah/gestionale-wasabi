import { Button } from "@/components/ui/button";
import { PaymentsSummaryData } from "../../../hooks/usePaymentsHistory";
import usePrinter from "@/app/(site)/hooks/printing/usePrinter";

interface PrintSummaryProps {
  summaryData: PaymentsSummaryData;
  firstOrderDate?: Date;
}

export default function PrintSummary({ summaryData, firstOrderDate }: PrintSummaryProps) {
  const isButtonDisabled = Object.values(summaryData.totals).every(({ total }) => total === 0);
  const { printPaymentSummary } = usePrinter();

  return (
    <Button
      className="mt-auto"
      onClick={async () =>
        await printPaymentSummary({ summaryData, date: new Date(firstOrderDate || new Date()) })
      }
      disabled={isButtonDisabled}
    >
      Stampa riassunto
    </Button>
  );
}
