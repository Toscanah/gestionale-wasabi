import applyDiscount from "@/app/(site)/util/functions/applyDiscount";

export default function Total({ orderTotal, discount }: { orderTotal: number; discount: number }) {
  return (
    <div className="w-full flex flex-col overflow-hidden border-foreground justify-center">
      <div className="w-full text-center text-2xl border rounded-t-lg bg-foreground text-primary-foreground h-12 flex flex-col justify-center">
        TOTALE
      </div>
      <div className="w-full text-center text-2xl h-12 font-bold border-x border-b rounded-b-lg flex flex-col justify-center">
        € {applyDiscount(orderTotal, discount)}
      </div>
    </div>
  );
}
