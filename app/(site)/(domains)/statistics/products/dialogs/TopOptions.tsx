import DialogWrapper from "@/app/(site)/components/ui/dialog/DialogWrapper";
import { ProductWithStats } from "@/app/(site)/lib/shared";
import { Button } from "@/components/ui/button";

interface TopOptionsProps {
  product: ProductWithStats;
}

export default function TopOptions({ product }: TopOptionsProps) {
  return (
    <DialogWrapper
      size="small"
      trigger={<Button className="w-40" variant="default">Vedi opzioni usate</Button>}
      title="Opzioni più utilizzate"
      putSeparator
    >
      <div className="space-y-2">
        {product.optionsRank.length > 0 ? (
          <ul className="list-decimal list-inside">
            {product.optionsRank.map((option, index) => (
              <li key={index} className="text-lg">
                <span>{option.option}</span> ({option.count} volte)
              </li>
            ))}
          </ul>
        ) : (
          <p className="flex w-full justify-center items-center text-lg text-gray-500">
            Nessuna opzione utilizzata per questo prodotto
          </p>
        )}
      </div>
    </DialogWrapper>
  );
}
