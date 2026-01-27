import { Button } from "@/components/ui/button";
import usePrinter from "@/hooks/printing/usePrinter";
import { DateRange } from "react-day-picker";
import formatDateFilter from "@/lib/shared/utils/global/date/formatDateFilter";
import { PaymentContracts } from "@/lib/shared";

interface PrintSummaryProps {
  summaryData: PaymentContracts.GetSummary.Output;
  period: DateRange | undefined;
}

export default function PrintSummary({
  summaryData,
  period,
  disabled,
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
