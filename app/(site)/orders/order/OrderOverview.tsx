import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import formatRice from "../../util/functions/formatRice";
import { useWasabiContext } from "../../context/WasabiContext";
import { Table } from "@tanstack/react-table";
import { ProductInOrderType } from "../../types/ProductInOrderType";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { AnyOrder, HomeOrder, PickupOrder, TableOrder } from "../../types/PrismaOrders";
import { Actions } from "./OrderTable";
import DialogWrapper from "../../components/dialog/DialogWrapper";
import OrderHistory from "../../components/OrderHistory";
import { OrderType } from "../../types/OrderType";
import { CustomerWithDetails } from "../../types/CustomerWithDetails";
import fetchRequest from "../../util/functions/fetchRequest";

export default function OrderSummary({
  order,
  table,
  deleteProducts,
  setAction,
  copyFromOrder,
}: {
  order: AnyOrder;
  table: Table<ProductInOrderType>;
  deleteProducts: () => void;
  setAction: Dispatch<SetStateAction<Actions>>;
  copyFromOrder: (order: HomeOrder | PickupOrder) => void;
}) {
  const { rice } = useWasabiContext();
  const [usedRice, setUsedRice] = useState<number>(0);
  const [customer, setCustomer] = useState<CustomerWithDetails | undefined>(undefined);

  useEffect(() => {
    if (order.type == OrderType.TABLE) return;

    const customerId =
      order.type === OrderType.PICK_UP
        ? (order as PickupOrder).pickup_order?.customer?.id
        : (order as HomeOrder).home_order?.customer?.id;

    fetchRequest<CustomerWithDetails>("GET", "/api/customers/", "getCustomerWithDetails", {
      customerId,
    }).then((customer) => setCustomer(customer));
  }, []);

  useEffect(() => {
    setUsedRice(
      order.products.reduce(
        (total, product) => total + (product.product.rice ?? 0) * product.quantity,
        0
      )
    );
  }, [order.products]);

  return (
    <div className="w-[20%] flex flex-col gap-6 h-full">
      <Button
        className="w-full h-12 text-xl"
        variant={"destructive"}
        onClick={() => deleteProducts()}
        disabled={table.getFilteredSelectedRowModel().rows.length == 0}
      >
        Cancella prodotti selezionati
      </Button>

      <Button className="w-full h-12 text-xl" variant={"destructive"} onClick={() => {}}>
        Elimina ordine
      </Button>

      {order.type !== OrderType.TABLE && customer && (
        <DialogWrapper
          title="Storico ordini"
          trigger={
            <Button type="button" variant={"outline"} className="h-12 text-xl">
              Vedi ordini precedenti
            </Button>
          }
        >
          <OrderHistory customer={customer} onCreate={copyFromOrder} />
        </DialogWrapper>
      )}

      <div className="mt-auto flex flex-col gap-6">
        <div className="w-full flex flex-col overflow-hidden border-foreground">
          <div className="w-full text-center text-2xl border rounded-t-lg bg-foreground text-primary-foreground h-12 p-2">
            RISO
          </div>

          <div className="w-full text-center text-2xl h-12 max-h-12 font-bold border-x flex ">
            <div
              className={cn(
                "w-1/2 border-r p-2 h-12",
                rice.amount - usedRice < rice.threshold && "text-destructive"
              )}
            >
              Rimanente
            </div>
            <div className="w-1/2 p-2 h-12">Ordine</div>
          </div>

          <div className="w-full text-center text-2xl h-12 border flex max-h-12 rounded-b-lg">
            <div
              className={cn(
                "w-1/2 border-r p-2 h-12",
                rice.amount - usedRice < rice.threshold && "text-destructive"
              )}
            >
              {formatRice(rice.amount - usedRice)}
            </div>
            <div className="w-1/2 p-2 h-12">{formatRice(usedRice)}</div>
          </div>
        </div>

        <div className="w-full flex flex-col *:p-2 overflow-hidden border-foreground">
          <div className="w-full text-center text-2xl border rounded-t-lg bg-foreground text-primary-foreground h-12">
            TOTALE
          </div>
          <div className="w-full text-center text-2xl h-12 font-bold border-x border-b rounded-b-lg ">
            € {order.total}
          </div>
        </div>

        <div className="flex gap-6">
          <Button
            className="w-full text-3xl h-12"
            onClick={() => setAction("payPart")}
            disabled={
              order.products.length === 0 || // Disable if there are no products
              (order.products.length === 1 && order.products[0].quantity <= 1) // Disable if there is one product and its quantity is 1 or less
            }
          >
            Dividi
          </Button>
          <Button className="w-full text-3xl h-12" disabled={order.products.length <= 0}>
            Romana
          </Button>
        </div>

        <Button className="w-full text-3xl h-12">Stampa</Button>
        <Button
          className="w-full text-3xl h-12"
          onClick={() => setAction("payFull")}
          disabled={order.total == 0}
        >
          PAGA
        </Button>
      </div>
    </div>
  );
}
