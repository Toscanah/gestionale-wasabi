import { Badge } from "@/components/ui/badge";
import { CustomerWithDetails } from "@/app/(site)/models";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { ProductInOrder } from "@/app/(site)/models";
import applyDiscount from "../../util/functions/applyDiscount";
import HistoryStats from "./HistoryStats";
import OrderDetail from "./OrderDetail";

type ProductStats = {
  desc: string;
  quantity: number;
};

export type OrderStats = {
  mostBoughtProduct: ProductStats | undefined;
  leastBoughtProduct: ProductStats | undefined;
  avgOrdersPerWeek: number;
  avgOrdersPerMonth: number;
  avgOrdersPerYear: number;
  avgOrderCost: number;
};

interface OrderHistoryProps {
  customer: CustomerWithDetails;
  onCreate?: (newProducts: ProductInOrder[]) => void;
}

export default function OrderHistory({ customer, onCreate }: OrderHistoryProps) {
  const [selectedProducts, setSelectedProducts] = useState<ProductInOrder[]>([]);
  const orderTypes = useMemo(
    () => [
      { type: "Domicilio", orders: customer.home_orders },
      { type: "Asporto", orders: customer.pickup_orders },
    ],
    [customer]
  );

  const [stats, setStats] = useState<OrderStats>({
    mostBoughtProduct: undefined,
    leastBoughtProduct: undefined,
    avgOrdersPerWeek: 0,
    avgOrdersPerMonth: 0,
    avgOrdersPerYear: 0,
    avgOrderCost: 0,
  });

  const allOrders = useMemo(
    () => [...customer.home_orders, ...customer.pickup_orders],
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
      (acc: any, product) => {
        acc[product.id] = acc[product.id] || { desc: product.desc, quantity: 0 };
        acc[product.id].quantity += product.quantity;
        return acc;
      },
      {}
    );

    const sortedProducts = Object.values(productStats).sort((a, b) => b.quantity - a.quantity);
    const mostBoughtProduct = sortedProducts[0];
    const leastBoughtProduct = sortedProducts[sortedProducts.length - 1];

    const ordersByDate = allOrders.map((order) => new Date(order.order.created_at));
    const ordersPerWeek: Record<string, number> = {};
    const ordersPerMonth: Record<string, number> = {};
    const ordersPerYear: Record<string, number> = {};

    ordersByDate.forEach((date) => {
      const week = `${date.getFullYear()}-${Math.ceil((date.getMonth() + 1) / 4)}`;
      const month = `${date.getFullYear()}-${date.getMonth() + 1}`;
      const year = `${date.getFullYear()}`;

      ordersPerWeek[week] = (ordersPerWeek[week] || 0) + 1;
      ordersPerMonth[month] = (ordersPerMonth[month] || 0) + 1;
      ordersPerYear[year] = (ordersPerYear[year] || 0) + 1;
    });

    const avgOrdersPerWeek =
      Object.values(ordersPerWeek).reduce((sum, count) => sum + count, 0) /
      Object.keys(ordersPerWeek).length;
    const avgOrdersPerMonth =
      Object.values(ordersPerMonth).reduce((sum, count) => sum + count, 0) /
      Object.keys(ordersPerMonth).length;
    const avgOrdersPerYear =
      Object.values(ordersPerYear).reduce((sum, count) => sum + count, 0) /
      Object.keys(ordersPerYear).length;

    const totalOrderCost = allOrders.reduce(
      (sum, order) => sum + applyDiscount(order.order.total, order.order.discount),
      0
    );
    const avgOrderCost = totalOrderCost / allOrders.length;

    setStats({
      mostBoughtProduct,
      leastBoughtProduct,
      avgOrdersPerWeek,
      avgOrdersPerMonth,
      avgOrdersPerYear,
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

    return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  };

  const handleCheckboxChange = (product: ProductInOrder) =>
    setSelectedProducts((prevSelected) =>
      prevSelected.some((p) => p.id === product.id)
        ? prevSelected.filter((p) => p.id !== product.id)
        : [...prevSelected, product]
    );

  const handleRecreate = () => onCreate?.(selectedProducts);

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
        className="max-h-[450px] w-[40vw] overflow-y-auto overflow-x-hidden pr-4"
      >
        <AccordionItem value={"stats"} key={"stats"}>
          <AccordionTrigger className="text-2xl">Vedi statistiche</AccordionTrigger>
          <HistoryStats stats={stats} />
        </AccordionItem>

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
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <OrderDetail
                    onCheckboxChange={handleCheckboxChange}
                    type={type}
                    onCreate={onCreate}
                    sortedProducts={order.products.sort((a, b) => b.quantity - a.quantity)}
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
