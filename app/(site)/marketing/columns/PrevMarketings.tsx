import { Button } from "@/components/ui/button";
import DialogWrapper from "../../components/dialog/DialogWrapper";
import { MarketingOnCustomer } from "../../models";
import capitalizeFirstLetter from "../../functions/formatting-parsing/capitalizeFirstLetter";

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("it-IT", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(new Date(date));

export default function PrevMarketings({ marketings }: { marketings: MarketingOnCustomer[] }) {
  return (
    <DialogWrapper
      trigger={<Button data-no-row-click>Vedi</Button>}
      title="Azioni di marketing precedenti"
      putSeparator
    >
      <div className="max-h-[20rem] overflow-y-auto ">
        {marketings.length > 0 ? (
          marketings.map((marketing) => (
            <div key={marketing.id} className="p-2 border-b">
              <p className="font-bold">{marketing.marketing.label}</p>
              <p className="text-sm text-gray-500">
                {capitalizeFirstLetter(formatDate(marketing.created_at).replace(", ", " alle "))}
              </p>
            </div>
          ))
        ) : (
          <p className="w-full flex justify-center items-center">
            Nessuna azione di marketing precedente per questo cliente
          </p>
        )}
      </div>
    </DialogWrapper>
  );
}
