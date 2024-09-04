import { Badge } from "@/components/ui/badge";
import { CustomerWithDetails } from "../types/CustomerWithDetails";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useEffect, useState } from "react";
import { ProductWithInfo } from "../types/ProductWithInfo";
import { Separator } from "@/components/ui/separator";
import { HomeOrder, PickupOrder } from "../types/PrismaOrders";
import { Button } from "@/components/ui/button";

type ProductStats = {
  desc: string;
  quantity: number;
};

type OrderStats = {
  mostBoughtProduct: ProductStats | undefined;
  leastBoughtProduct: ProductStats | undefined;
  avgOrdersPerWeek: number;
  avgOrdersPerMonth: number;
  avgOrdersPerYear: number;
  avgOrderCost: number;
};

export default function OrderHistory({
  customer,
  onCreate,
}: {
  customer: CustomerWithDetails;
  onCreate?: (order: HomeOrder | PickupOrder) => void;
}) {
  const orderTypes = [
    { type: "Domicilio", orders: customer.home_orders },
    { type: "Asporto", orders: customer.pickup_orders },
  ];
  const [stats, setStats] = useState<OrderStats>({
    mostBoughtProduct: undefined,
    leastBoughtProduct: undefined,
    avgOrdersPerWeek: 0,
    avgOrdersPerMonth: 0,
    avgOrdersPerYear: 0,
    avgOrderCost: 0,
  });

  useEffect(() => {
    const allOrders = [...customer.home_orders, ...customer.pickup_orders];

    const productQuantities = allOrders.flatMap((order) =>
      order.order.products.map((product) => ({
        id: product.product.id,
        desc: product.product.desc,
        quantity: product.quantity,
      }))
    );

    const productStats: Record<string, ProductStats> = productQuantities.reduce(
      (acc: any, product) => {
        if (!acc[product.id]) {
          acc[product.id] = { desc: product.desc, quantity: 0 };
        }
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

    const totalOrderCost = allOrders.reduce((sum, order) => sum + order.order.total, 0);
    const avgOrderCost = totalOrderCost / allOrders.length;

    setStats({
      mostBoughtProduct,
      leastBoughtProduct,
      avgOrdersPerWeek,
      avgOrdersPerMonth,
      avgOrdersPerYear,
      avgOrderCost,
    });
  }, [customer]);

  const formatDateWithDay = (dateString: Date) => {
    const date = new Date(dateString);

    // Create a formatter for the day of the week and date
    const dayFormatter = new Intl.DateTimeFormat("it-IT", { weekday: "long" });
    const dateFormatter = new Intl.DateTimeFormat("it-IT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    const dayOfWeek = dayFormatter.format(date);
    const formattedDate = dateFormatter.format(date);

    // Capitalize the first letter of the day of the week
    const capitalizedDay = dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1);

    return `${capitalizedDay}, ${formattedDate}`;
  };

  return (
    <div className="w-full h-full flex flex-col gap-4">
      {!orderTypes.some(({ orders }) => orders.length > 0) ? (
        <p className="text-xl text-center mt-4">Nessun ordine registrato</p>
      ) : (
        <Accordion
          type="multiple"
          className="max-h-[450px] w-[40vw] overflow-y-auto overflow-x-hidden pr-4"
        >
          <AccordionItem value={"stats"} key={"stats"}>
            <AccordionTrigger className="text-xl">Vedi statistiche</AccordionTrigger>
            <AccordionContent className="space-y-4">
              {orderTypes.some(({ orders }) => orders.length > 0) && (
                <div>
                  <div>
                    <h3 className="text-xl">Prodotto più acquistato</h3>
                    {stats.mostBoughtProduct ? (
                      <p>
                        - {stats.mostBoughtProduct.desc} ({stats.mostBoughtProduct.quantity})
                      </p>
                    ) : (
                      <p>Nessun prodotto</p>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl">Prodotto meno acquistato</h3>
                    {stats.leastBoughtProduct ? (
                      <p>
                        - {stats.leastBoughtProduct.desc} ({stats.leastBoughtProduct.quantity})
                      </p>
                    ) : (
                      <p>Nessun prodotto</p>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl">Frequenza ordini alla settimana</h3>
                    <p>- {stats.avgOrdersPerWeek.toFixed(2)}</p>
                  </div>
                  <div>
                    <h3 className="text-xl">Frequenza ordini al mese</h3>
                    <p>- {stats.avgOrdersPerMonth.toFixed(2)}</p>
                  </div>
                  <div>
                    <h3 className="text-xl">Frequenza ordini all'anno</h3>
                    <p>- {stats.avgOrdersPerYear.toFixed(2)}</p>
                  </div>
                  <div>
                    <h3 className="text-xl">Costo medio ordine</h3>
                    <p>- € {stats.avgOrderCost.toFixed(2)}</p>
                  </div>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>

          {orderTypes.map(({ type, orders }) =>
            orders.map(({ id, order }) => {
              const sortedProducts = [...order.products].sort((a, b) => b.quantity - a.quantity);

              return (
                <AccordionItem value={`${type}-${id}`} key={`${type}-${id}`}>
                  <AccordionTrigger className="text-xl">
                    <div className="flex gap-4 items-center justify-between">
                      <span>
                        <Badge>{type}</Badge>
                        {formatDateWithDay(order.created_at)} - {"€ " + order.total}
                      </span>
                      {onCreate && <Button onClick={() => onCreate(order as any)}>Ricrea</Button>}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4">
                    {sortedProducts.length > 0 ? (
                      <ul className="list-disc list-inside">
                        {sortedProducts.map((product) => (
                          <li
                            key={product.id}
                            className="text-xl flex justify-between items-center"
                          >
                            <span className="">
                              {product.quantity} x {product.product.desc}
                              {product.options.length > 0 && (
                                <span>
                                  {" "}
                                  (
                                  {product.options
                                    .map((option) => option.option.option_name)
                                    .join(", ")}
                                  )
                                </span>
                              )}
                            </span>
                            <span className="font-semibold">
                              {type === "Domicilio"
                                ? `€ ${(product.quantity * product.product.home_price).toFixed(2)}`
                                : `€ ${(product.quantity * product.product.site_price).toFixed(2)}`}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xl">Nessun prodotto in questo ordine</p>
                    )}
                  </AccordionContent>
                </AccordionItem>
              );
            })
          )}
        </Accordion>
      )}
    </div>
  );
}
