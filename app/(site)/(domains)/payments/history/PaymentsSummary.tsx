import roundToTwo from "../../../lib/utils/global/number/roundToTwo";
import WasabiDialog from "@/app/(site)/components/ui/wasabi/WasabiDialog";
import { PaymentContracts } from "@/app/(site)/lib/shared";
import toEuro from "@/app/(site)/lib/utils/global/string/toEuro";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function PaymentsSummary({
  summaryData,
  disabled,
}: { summaryData: PaymentContracts.GetSummary.Output } & { disabled: boolean }) {
  const { totals, totalAmount, rawTotalAmount, centsDifference, discountsAndPromotions } =
    summaryData;

  const total = toEuro(totalAmount);
  const parsedCentsDifference = toEuro(centsDifference);

  return (
    <WasabiDialog
      title="Riepilogo generale"
      putSeparator
      putUpperBorder
      desc="I dati mostrati sono calcolati in base ai filtri applicati"
      trigger={<Button disabled={disabled}>Mostra riepilogo generale</Button>}
    >
      <table className="w-[40rem] text-xl">
        <tbody>
          <tr>
            <td className="text-left">Totale contanti</td>
            <td className="text-left">{toEuro(totals.CASH.total)}</td>
          </tr>
          <tr>
            <td className="text-left">Totale carta</td>
            <td className="text-left">{toEuro(totals.CARD.total)}</td>
          </tr>
          <tr>
            <td className="text-left">Totale buoni pasto</td>
            <td className="text-left">{toEuro(totals.VOUCH.total)}</td>
          </tr>

          <tr>
            <td colSpan={2}>
              <Separator className="my-2" />
            </td>
          </tr>

          <tr>
            <td className="text-left text-red-600">Sconti manuali</td>
            <td className="text-left text-red-600">- {toEuro(discountsAndPromotions.manual)}</td>
          </tr>
          <tr>
            <td className="text-left text-red-600">Promo fisse</td>
            <td className="text-left text-red-600">
              - {toEuro(discountsAndPromotions.fixed_promotions)}
            </td>
          </tr>
          <tr>
            <td className="text-left text-red-600">Promo %</td>
            <td className="text-left text-red-600">
              - {toEuro(discountsAndPromotions.percentage_promotions)}
            </td>
          </tr>
          <tr>
            <td className="text-left text-red-600">Gift card</td>
            <td className="text-left text-red-600">
              - {toEuro(discountsAndPromotions.gift_cards)}
            </td>
          </tr>

          <tr>
            <td colSpan={2}>
              <Separator className="my-2" />
            </td>
          </tr>

          <tr>
            <td className="text-left">Totale lordo</td>
            <td className="text-left">{toEuro(rawTotalAmount)}</td>
          </tr>
          <tr>
            <td className="font-bold text-left">Totale giornaliero</td>
            <td className="font-bold text-left">
              {total}{" "}
              {parsedCentsDifference !== "0.00" && (
                <span className="text-muted-foreground">
                  (+ {summaryData.centsDifference.toFixed(2)})
                </span>
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </WasabiDialog>
  );
}
