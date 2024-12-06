import applyDiscount from "@/app/(site)/util/functions/applyDiscount";
import formatAmount from "@/app/(site)/util/functions/formatAmount";

interface TotalProps {
  orderTotal: number;
  discount: number;
}

export default function Total({ orderTotal, discount }: TotalProps) {
  return (
    <div className="w-full flex flex-col overflow-hidden border-foreground justify-center">
      <div className="w-full text-center text-2xl border rounded-t-lg bg-foreground text-primary-foreground h-12 flex flex-col justify-center">
        TOTALE
      </div>
      <div className="w-full text-center text-2xl h-12 font-bold border-x border-b rounded-b-lg flex flex-col justify-center">
        € {formatAmount(applyDiscount(orderTotal, discount))}
      </div>
    </div>
  );
}
