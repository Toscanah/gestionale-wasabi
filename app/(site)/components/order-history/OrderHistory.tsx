import { Badge } from "@/components/ui/badge";
import { CustomerWithDetails } from "@shared";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { ProductInOrder } from "@shared";
import applyDiscount from "../../lib/order-management/applyDiscount";
import HistoryStats from "./HistoryStats";
import OrderDetail from "./OrderDetail";
import capitalizeFirstLetter from "../../lib/formatting-parsing/capitalizeFirstLetter";
import filterDeletedProducts from "../../lib/product-management/filterDeletedProducts";

type ProductStats = {
  desc: string;
  quantity: number;
};

export type OrderStats = {
  mostBoughtProduct: ProductStats | undefined;
  leastBoughtProduct: ProductStats | undefined;
  totalSpent: number;
  avgOrderCost: number;
};

interface OrderHistoryProps {
  customer: CustomerWithDetails;
  onCreate?: (newProducts: ProductInOrder[]) => void;
  noStatistics?: boolean;
}

export default function OrderHistory({ customer, onCreate, noStatistics }: OrderHistoryProps) {
  const [selectedProducts, setSelectedProducts] = useState<ProductInOrder[]>([]);
  const orderTypes = useMemo(
    () => [
      {
        type: "Domicilio",
        orders: customer.home_orders.filter(
          (order) => order.order.total > 0 && order.order.state === "PAID"
        ),
      },
      {
        type: "Asporto",
        orders: customer.pickup_orders.filter(
          (order) => order.order.total > 0 && order.order.state === "PAID"
        ),
      },
    ],
    [customer]
  );

  const [stats, setStats] = useState<OrderStats>({
    mostBoughtProduct: undefined,
    leastBoughtProduct: undefined,
    totalSpent: 0,
    avgOrderCost: 0,
  });

  const allOrders = useMemo(
    () =>
      [...customer.home_orders, ...customer.pickup_orders].filter(
        (order) => order.order.total > 0 && order.order.state === "PAID"
      ),
    [customer.home_orders, customer.pickup_orders]
  );

  useEffect(() => {
    if (!allOrders.length) return;

    const productQuantities = allOrders.flatMap((order) =>
      order.order.products.map((product) => ({
        id: product.product.id,
        desc: product.product.desc,
        quantity: product.quantity,
      }))
    );

    const productStats: Record<string, ProductStats> = productQuantities.reduce(
      (acc, { id, desc, quantity }) => {
        if (!acc[id]) {
          acc[id] = { desc, quantity: 0 };
        }
        acc[id].quantity += quantity;
        return acc;
      },
      {} as Record<string, ProductStats>
    );

    const sortedProducts = Object.values(productStats).sort((a, b) => b.quantity - a.quantity);
    const mostBoughtProduct = sortedProducts[0];
    const leastBoughtProduct = sortedProducts[sortedProducts.length - 1];

    const totalSpent = allOrders.reduce(
      (sum, order) => sum + applyDiscount(order.order.total, order.order.discount),
      0
    );
    const avgOrderCost = totalSpent / allOrders.length;

    setStats({
      mostBoughtProduct,
      leastBoughtProduct,
      totalSpent,
      avgOrderCost,
    });
  }, [allOrders]);

  const formatDateWithDay = (dateString: Date) => {
    const formattedDate = new Intl.DateTimeFormat("it-IT", {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(dateString));

    return capitalizeFirstLetter(formattedDate);
  };

  const handleCheckboxChange = (product: ProductInOrder) =>
    setSelectedProducts((prevSelected) =>
      prevSelected.some((p) => p.id === product.id)
        ? prevSelected.filter((p) => p.id !== product.id)
        : [...prevSelected, product]
    );

  const handleRecreate = () => onCreate?.(filterDeletedProducts(selectedProducts));

  if (!orderTypes.some(({ orders }) => orders && orders.length > 0)) {
    return <p className="text-2xl text-center">Nessun ordine registrato</p>;
  }

  return (
    <div className="w-full h-full flex flex-col gap-4">
      <Accordion
        onValueChange={(e) => {
          if (!e) return setSelectedProducts([]);

          const [orderType, orderIdString] = e.split("-");
          const selectedOrderType = orderTypes.find((type) => type.type === orderType);
          const selectedOrder = selectedOrderType?.orders.find(
            (order) => order.id === Number(orderIdString)
          );

          setSelectedProducts(selectedOrder?.order.products || []);
        }}
        type="single"
        collapsible
        className="max-h-[450px] overflow-y-auto overflow-x-hidden pr-4"
      >
        {!noStatistics && (
          <AccordionItem value={"stats"} key={"stats"}>
            <AccordionTrigger className="text-2xl">Vedi statistiche</AccordionTrigger>
            <HistoryStats stats={stats} />
          </AccordionItem>
        )}

        {orderTypes.map(({ type, orders }) =>
          orders
            .sort(
              (a, b) =>
                new Date(b.order.created_at).getTime() - new Date(a.order.created_at).getTime()
            )
            .map(({ id, order }) => (
              <AccordionItem value={`${type}-${id}`} key={`${type}-${id}`}>
                <AccordionTrigger className="text-2xl">
                  <div className="flex gap-4 items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Badge className="text-base">{type}</Badge>
                      {formatDateWithDay(order.created_at)} -{" "}
                      {"€ " + applyDiscount(order.total, order.discount)}
                      {order.discount !== 0 ? <> (sconto {order.discount}%)</> : <></>}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <OrderDetail
                    onCheckboxChange={handleCheckboxChange}
                    type={type}
                    onCreate={onCreate}
                    sortedProducts={filterDeletedProducts(
                      order.products.sort((a, b) => b.quantity - a.quantity)
                    )}
                  />

                  {onCreate && (
                    <Button
                      className="w-full"
                      onClick={handleRecreate}
                      disabled={selectedProducts.length === 0}
                    >
                      Ricrea questo ordine
                    </Button>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))
        )}
      </Accordion>
    </div>
  );
}
