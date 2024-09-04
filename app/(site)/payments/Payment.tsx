import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { AnyOrder } from "../types/PrismaOrders";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Coins, CreditCard, ForkKnife, Money } from "@phosphor-icons/react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import fetchRequest from "../util/functions/fetchRequest";
import { useWasabiContext } from "../context/WasabiContext";
import { OrderType } from "../types/OrderType";
import { ProductInOrderType } from "../types/ProductInOrderType";

enum TYPE_OF_PAYMENT {
  CASH = "cash",
  CARD = "card",
  VOUCH = "vouch",
  CREDIT = "credit",
}

const paymentMethods = [
  { type: TYPE_OF_PAYMENT.CASH, label: "Contanti", icon: Money },
  { type: TYPE_OF_PAYMENT.CARD, label: "Carta", icon: CreditCard },
  { type: TYPE_OF_PAYMENT.VOUCH, label: "Buoni pasto", icon: ForkKnife },
  { type: TYPE_OF_PAYMENT.CREDIT, label: "Credito", icon: Coins },
];

export default function Payment({
  handleBackButton,
  handleOrderPaid,
  order,
  type,
  setProducts,
}: {
  handleBackButton: () => void;
  handleOrderPaid: () => void;
  order: AnyOrder;
  type: "full" | "partial";
  setProducts: Dispatch<SetStateAction<ProductInOrderType[]>>;
}) {
  const { onOrdersUpdate } = useWasabiContext();
  const [paymentAmounts, setPaymentAmounts] = useState({
    [TYPE_OF_PAYMENT.CASH]: undefined,
    [TYPE_OF_PAYMENT.CARD]: undefined,
    [TYPE_OF_PAYMENT.VOUCH]: undefined,
    [TYPE_OF_PAYMENT.CREDIT]: undefined,
  });

  const [payAll, setPayAll] = useState<TYPE_OF_PAYMENT | undefined>(undefined);

  const handlePayAll = () => {
    if (payAll) {
      setPaymentAmounts({
        [TYPE_OF_PAYMENT.CASH]: undefined,
        [TYPE_OF_PAYMENT.CARD]: undefined,
        [TYPE_OF_PAYMENT.VOUCH]: undefined,
        [TYPE_OF_PAYMENT.CREDIT]: undefined,
        [payAll]: order.total ?? undefined,
      });
    }
  };

  const handlePaymentChange = (type: TYPE_OF_PAYMENT, value: number) => {
    console.log(value);

    setPaymentAmounts((prev) => ({
      ...prev,
      [type]: isNaN(value) ? undefined : value,
    }));
  };

  useEffect(() => setPayAll(undefined), [paymentAmounts]);

  const getPaymentName = (type: TYPE_OF_PAYMENT) => {
    switch (type) {
      case TYPE_OF_PAYMENT.CARD:
        return "la carta";
      case TYPE_OF_PAYMENT.CASH:
        return "contanti";
      case TYPE_OF_PAYMENT.CREDIT:
        return "i crediti";
      case TYPE_OF_PAYMENT.VOUCH:
        return "i buoni pasto";
      default:
        return "";
    }
  };

  const payOrder = () => {
    const payments = Object.entries(paymentAmounts)
      .filter(([_, amount]) => amount && amount > 0)
      .map(([type, amount]) => ({
        amount,
        type: type.toUpperCase(),
        order_id: order.id,
      }));

    const productsToPay = order.products;

    fetchRequest<any>("POST", "/api/payments/", "payOrder", {
      payments,
      type,
      productsToPay,
    }).then((createdPayments) => {
      onOrdersUpdate(order.type as OrderType);
      handleOrderPaid();

      if (type == "partial") {
        setProducts((prevProducts) => {
          const productsToPayMap = new Map(order.products.map((product) => [product.id, product]));

          const newProducts = prevProducts.map((product) => {
            const productToPay = productsToPayMap.get(product.id);

            if (productToPay) {
              const newQuantity = product.quantity - productToPay.quantity;
              const newPaidQuantity = product.paidQuantity + productToPay.quantity;
              const newTotal =
                newQuantity *
                (order.type === OrderType.TO_HOME
                  ? product.product.home_price
                  : product.product.site_price);

              return {
                ...product,
                quantity: newQuantity,
                paidQuantity: newPaidQuantity,
                total: newTotal,
                isPaidFully: newPaidQuantity >= product.quantity ? true : product.isPaidFully,
              };
            } else {
              return product;
            }
          });

          return newProducts;
        });
      }
    });
  };

  const totalPaid = Object.values(paymentAmounts).reduce((sum, amount) => sum + (amount ?? 0), 0);
  const remainingAmount = (order.total ?? 0) - totalPaid;

  return (
    <div className="w-full h-full flex flex-col gap-12">
      <div className="w-full flex justify-between flex-col gap-6">
        {/* <Button onClick={() => handleBackButton()} className="w-min">
          Torna all'ordine
        </Button> */}

        <div className="flex justify-between">
          {paymentMethods.map(({ type, label, icon: Icon }) => (
            <div key={type} className="space-y-4">
              <div
                onClick={() => setPayAll((prev) => (prev === type ? undefined : type))}
                className={cn(
                  "w-64 h-64 rounded-md flex border items-center justify-center hover:border-2 hover:cursor-pointer",
                  payAll === type ? "border-4 border-black" : "hover:border-2"
                )}
              >
                <Icon size={140} />
              </div>
              <div className="space-y-2">
                <Label className="text-lg">{label}</Label>
                <Input
                  value={paymentAmounts[type]}
                  type="number"
                  onChange={(e) => handlePaymentChange(type, e.target.valueAsNumber)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div className="w-full text-4xl flex justify-between h-full gap-8">
        <div className="flex flex-col gap-4 w-1/2 h-full">
          <div className="text-5xl">
            <b>RIEPILOGO:</b>
          </div>

          {paymentMethods.filter(
            ({ type }) => paymentAmounts[type] !== undefined && paymentAmounts[type] !== 0
          ).length > 0 && (
            <ul className="list-disc list-inside">
              {paymentMethods.map(
                ({ type }) =>
                  paymentAmounts[type] !== 0 && (
                    <li key={type} className="text-3xl">
                      Euro pagati con {getPaymentName(type)}: € {paymentAmounts[type]}
                    </li>
                  )
              )}
            </ul>
          )}

          <Separator className="w-full" orientation="horizontal" />

          <div className="text-3xl">Subtotale: € {totalPaid}</div>
          <div className="text-3xl">Rimanente (resto): € {remainingAmount}</div>

          <Separator className="w-full" orientation="horizontal" />

          <div className="text-3xl">Totale da pagare: € {order.total}</div>
        </div>

        <Separator orientation="vertical" />

        <div className="flex flex-col gap-6 w-1/2 text-4xl items-center text-center h-full justify-center">
          <h1>
            {!payAll ? (
              <>
                Vuoi procedere con l'incasso di <b>€ {order.total}</b>?
              </>
            ) : (
              <>
                Stai per pagare <b>€ {order.total}</b> con {getPaymentName(payAll)}, sei sicuro?
              </>
            )}
          </h1>

          <div className="w-full flex gap-6 items-center justify-center">
            <Button
              className="w-1/3 h-32 text-3xl"
              variant={"destructive"}
              onClick={() => (!payAll ? handleBackButton() : setPayAll(undefined))}
            >
              Cancella
            </Button>
            <Button
              onClick={() => (!payAll ? payOrder() : handlePayAll())}
              className="w-1/3 h-32 bg-green-500 text-3xl text-black hover:bg-green-500/90"
              disabled={payAll ? false : remainingAmount > 0}
            >
              Conferma
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
