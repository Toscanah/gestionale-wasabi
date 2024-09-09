import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import formatRice from "../../util/functions/formatRice";
import { useWasabiContext } from "../../context/WasabiContext";
import { Table } from "@tanstack/react-table";
import { ProductInOrderType } from "../../types/ProductInOrderType";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { AnyOrder, HomeOrder, PickupOrder } from "../../types/PrismaOrders";
import { Actions } from "./OrderTable";
import DialogWrapper from "../../components/dialog/DialogWrapper";
import OrderHistory from "../../components/OrderHistory";
import { OrderType } from "../../types/OrderType";
import { CustomerWithDetails } from "../../types/CustomerWithDetails";
import fetchRequest from "../../util/functions/fetchRequest";
import WhenSelector from "../../components/select/WhenSelector";
import { debounce } from "lodash";

export default function OrderSummary({
  order,
  table,
  deleteProducts,
  cancelOrder,
  setAction,
  addProducts,
}: {
  order: AnyOrder;
  table: Table<ProductInOrderType>;
  deleteProducts: () => void;
  cancelOrder: () => void;
  setAction: Dispatch<SetStateAction<Actions>>;
  addProducts: (newProducts: ProductInOrderType[]) => void;
}) {
  const { fetchRemainingRice, rice } = useWasabiContext();
  const [usedRice, setUsedRice] = useState<number>(0);
  const [customer, setCustomer] = useState<CustomerWithDetails | undefined>(undefined);
  const [orderTime, setOrderTime] = useState<string>(
    order.type !== OrderType.TABLE
      ? order.type == OrderType.PICK_UP
        ? (order as PickupOrder).pickup_order?.when ?? ""
        : (order as HomeOrder).home_order?.when ?? ""
      : ""
  );

  useEffect(() => {
    // I tavoli non hanno un cliente > no cronologia ordini
    // I pickup order possono o meno avere un cliente > (possibile) no cronologia ordini

    if (
      order.type == OrderType.TABLE ||
      (order.type == OrderType.PICK_UP && (order as PickupOrder).pickup_order?.customer_id == null)
    )
      return;

    const customerId =
      order.type === OrderType.PICK_UP
        ? (order as PickupOrder).pickup_order?.customer_id
        : (order as HomeOrder).home_order?.customer_id;

    fetchRequest<CustomerWithDetails>("GET", "/api/customers/", "getCustomerWithDetails", {
      customerId,
    }).then((customer) => {
      if (!customer) return;

      let filteredCustomer = { ...customer };

      if (order.type === OrderType.TO_HOME) {
        filteredCustomer.home_orders = customer.home_orders.filter(
          (homeOrder) => homeOrder.order_id !== order.id
        );
      } else if (order.type === OrderType.PICK_UP) {
        filteredCustomer.pickup_orders = customer.pickup_orders.filter(
          (pickupOrder) => pickupOrder.order_id !== order.id
        );
      }

      setCustomer(filteredCustomer);
    });
  }, []);

  useEffect(() => {
    console.log()

    setUsedRice(order.products.reduce((total, product) => total + product.riceQuantity, 0));

    const debouncedFetch = debounce(() => {
      fetchRemainingRice();
    }, 3000);
    debouncedFetch();

    return () => {
      debouncedFetch.cancel();
    };
  }, [order.products]);

  const updateOrderTime = (value: string) => {
    setOrderTime(value);
    fetchRequest("POST", "/api/orders/", "updateOrderTime", { time: value, orderId: order.id });
  };

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

      <DialogWrapper
        title="Sei sicuro?"
        variant="delete"
        trigger={
          <Button className="w-full h-12 text-xl" variant={"destructive"}>
            Elimina ordine
          </Button>
        }
        onDelete={() => cancelOrder()}
      >
        <div>Stai per eliminare questo ordine</div>
      </DialogWrapper>

      {order.type !== OrderType.TABLE && customer && (
        <DialogWrapper
          title="Storico ordini"
          trigger={
            <Button type="button" variant={"outline"} className="h-12 text-xl">
              Vedi ordini precedenti
            </Button>
          }
        >
          <OrderHistory customer={customer} onCreate={addProducts} />
        </DialogWrapper>
      )}

      {order.type !== OrderType.TABLE && (
        <WhenSelector
          className="h-12 text-2xl uppercase"
          value={orderTime == "immediate" ? "Subito" : orderTime}
          onValueChange={updateOrderTime}
        />
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
                rice.total.amount - usedRice < rice.total.threshold && "text-destructive"
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
                rice.total.amount - usedRice < rice.total.threshold && "text-destructive"
              )}
            >
              {formatRice(rice.total.amount - usedRice)}
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
              order.products.length === 0 ||
              (order.products.length === 1 && order.products[0].quantity <= 1)
            }
          >
            Dividi
          </Button>
          <Button
            onClick={() => setAction("payRoman")}
            className="w-full text-3xl h-12"
            disabled={order.products.length <= 0}
          >
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
