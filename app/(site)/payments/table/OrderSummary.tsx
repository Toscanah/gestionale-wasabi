import { Button } from "@/components/ui/button";
import DialogWrapper from "../../components/dialog/DialogWrapper";
import { Badge } from "@/components/ui/badge";
import { AnyOrder } from "@/app/(site)/models";
import { OrderType } from "@prisma/client";
import { OrderWithPayments } from "@/app/(site)/models";
import padOptionsString from "../../functions/formatting-parsing/printing/padOptionsString";
import formatAmount from "../../functions/formatting-parsing/formatAmount";

interface OrderSummaryProps {
  order: OrderWithPayments;
}

export default function OrderSummary({ order }: OrderSummaryProps) {
  return (
    <DialogWrapper
      size="medium"
      trigger={<Button type="button">Vedi ordine</Button>}
      title={
        <div className="flex gap-2 items-center">
          <Badge>
            {order.type == OrderType.HOME
              ? "Domicilio"
              : order.type == OrderType.TABLE
              ? "Tavolo"
              : "Asporto"}
          </Badge>
          Ordine del {new Date(order.created_at).toLocaleDateString("it-IT")} - €{" "}
          {formatAmount(order.total)}
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 max-h-[30vh] overflow-y-auto pr-4">
          {order.products.map((product) => (
            <div key={product.id}>
              <span className="text-xl">{product.quantity}</span>
              <span> x </span>
              <span className="text-xl font-bold">
                {product.product.desc}{" "}
                {product.options.length > 0 &&
                  "(" + padOptionsString(100, product.options) + ")"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </DialogWrapper>
  );
}
