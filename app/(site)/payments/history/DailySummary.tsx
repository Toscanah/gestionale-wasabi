import roundToTwo from "../../lib/formatting-parsing/roundToTwo";
import { PaymentsSummaryData } from "../../hooks/usePaymentsHistory";

export default function DailySummary({ summaryData }: { summaryData: PaymentsSummaryData }) {
  const { totals, totalAmount, rawTotalAmount } = summaryData;

  const totalDaily = roundToTwo(totalAmount);

  return (
    <table className="w-[25rem] text-xl">
      <tbody>
        <tr>
          <td className="text-left">Totale contanti</td>
          <td className="text-left">€{roundToTwo(totals.CASH.total)}</td>
        </tr>
        <tr>
          <td className="text-left">Totale carta</td>
          <td className="text-left">€{roundToTwo(totals.CARD.total)}</td>
        </tr>
        <tr>
          <td className="text-left">Totale buoni pasto</td>
          <td className="text-left">€{roundToTwo(totals.VOUCH.total)}</td>
        </tr>
        {/* <tr>
          <td className="text-left">Totale credito:</td>
          <td className="text-right">€{roundToTwo(totals.CREDIT.total)}</td>
        </tr> */}
        <tr>
          <td className="text-left">Totale lordo (no sconti)</td>
          <td className="text-left">€{roundToTwo(rawTotalAmount)}</td>
        </tr>
        {/* <tr>
          <td className="text-left text-muted">Sconto applicato:</td>
          <td className="text-right text-muted">€{roundToTwo(discountDifference)}</td>
        </tr> */}
        <tr>
          <td className="font-bold text-left">Totale giornaliero</td>
          <td className="font-bold text-left">€{totalDaily} <span className="text-muted-foreground">(+ {summaryData.centsDifference.toFixed(2)})</span></td>
        </tr>
        {/* {summaryData.centsDifference !== 0 && (
          <tr className="text-muted-foreground">
            <td className="text-left">Centesimi arrotondati</td>
            <td className="text-left">€ {summaryData.centsDifference.toFixed(2)}</td>
          </tr>
        )} */}
      </tbody>
    </table>
  );
}
