import { Button } from "@/components/ui/button";
import usePrinter from "@/app/(site)/hooks/printing/usePrinter";
import { PaymentsSummaryData } from "@/app/(site)/lib/services/payments/calculatePaymentsSummary";
import { DateRange } from "react-day-picker";
import formatDateFilter from "@/app/(site)/lib/utils/global/date/formatDateFilter";

interface PrintSummaryProps {
  summaryData: PaymentsSummaryData;
  period: DateRange | undefined;
}

export default function PrintSummary({
  summaryData,
  period,
  disabled
}: PrintSummaryProps & { disabled: boolean }) {
  const { printPaymentSummary } = usePrinter();
  const parsedDate = formatDateFilter("range", period);

  return (
    <Button
      className="mt-auto"
      onClick={async () => await printPaymentSummary({ summaryData, period: parsedDate })}
      disabled={disabled}
    >
      Stampa riassunto
    </Button>
  );
}
