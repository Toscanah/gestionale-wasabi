import { Badge } from "@/components/ui/badge";
import { CustomerWithDetails } from "@/app/(site)/lib/shared";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { ProductInOrder } from "@/app/(site)/lib/shared";
import getDiscountedTotal from "../../lib/services/order-management/getDiscountedTotal";
import HistoryStats from "./HistoryStats";
import OrderDetail from "./OrderDetail";
import capitalizeFirstLetter from "../../lib/utils/global/string/capitalizeFirstLetter";
import { getOrderTotal } from "../../lib/services/order-management/getOrderTotal";
import filterDeletedProducts from "../../lib/services/product-management/filterDeletedProducts";
import { OrderStatus } from "@prisma/client";
import useRecreateOrder from "../../hooks/order/history/useRecreateOrder";
import useOrderHistory from "../../hooks/order/history/useOrderHistory";
import { formatDateWithDay } from "./helpers";

interface OrderHistoryProps {
  customer: CustomerWithDetails;
  onCreate?: (newProducts: ProductInOrder[]) => void;
  noStatistics?: boolean;
}



export default function OrderHistory({ customer, onCreate, noStatistics }: OrderHistoryProps) {
  const { selectedProducts, resetProductSelection, updateProductSelection, getRecreatedProducts } =
    useRecreateOrder();

  const { allOrders, orderTypes } = useOrderHistory({ customer });

  if (!orderTypes.some(({ orders }) => orders && orders.length > 0)) {
    return <p className="text-2xl text-center">Nessun ordine registrato</p>;
  }

  return (
    <div className="w-full h-full flex flex-col gap-4">
      <Accordion
        onValueChange={(e) => {
          if (!e) return resetProductSelection();

          const [orderType, orderIdString] = e.split("-");
          const selectedOrderType = orderTypes.find((type) => type.type === orderType);
          const selectedOrder = selectedOrderType?.orders.find(
            (order) => order.id === Number(orderIdString)
          );

          (selectedOrder?.order.products || []).map(updateProductSelection);
        }}
        type="single"
        collapsible
        className="max-h-[450px] overflow-y-auto overflow-x-hidden pr-4"
      >
        {!noStatistics && (
          <AccordionItem value={"stats"} key={"stats"}>
            <AccordionTrigger className="text-2xl">Vedi statistiche</AccordionTrigger>
            <HistoryStats allOrders={allOrders} />
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
                      {"€ " + getOrderTotal({ order, applyDiscount: true })}
                      {order.discount !== 0 ? <> (sconto {order.discount}%)</> : <></>}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <OrderDetail
                    onCheckboxChange={updateProductSelection}
                    type={type}
                    onCreate={onCreate}
                    sortedProducts={filterDeletedProducts(
                      order.products.sort((a, b) => b.quantity - a.quantity)
                    )}
                  />

                  {onCreate && (
                    <Button
                      className="w-full"
                      onClick={() => onCreate?.(getRecreatedProducts())}
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
