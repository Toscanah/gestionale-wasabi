import {
  ComprehensiveCustomer,
  HomeOrderWithOrder,
  PickupOrderWithOrder,
} from "@/app/(site)/lib/shared";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductInOrder } from "@/app/(site)/lib/shared";
import StatsHistoryItem from "./stats/StatsHistoryItem";
import useRecreateOrder from "../../hooks/order/history/useRecreateOrder";
import useOrderHistory from "../../hooks/order/history/useOrderHistory";
import DetailAccordionItem from "./detail/DetailAccordionItem";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Accordion } from "@/components/ui/accordion";

interface OrderHistoryProps {
  customer: ComprehensiveCustomer;
  onCreate?: (newProducts: ProductInOrder[]) => void;
  noStatistics?: boolean;
}

function AnimatedTabsContent({
  value,
  currentValue,
  children,
}: {
  value: string;
  currentValue: string;
  children: React.ReactNode;
}) {
  return (
    <TabsContent value={value} forceMount className="p-0">
      <AnimatePresence mode="wait">
        {currentValue === value && (
          <motion.div
            key={value}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </TabsContent>
  );
}

export type PossibleOrder = HomeOrderWithOrder | PickupOrderWithOrder;

export default function OrderHistory({ customer, onCreate, noStatistics }: OrderHistoryProps) {
  const [currentTab, setCurrentTab] = useState("orders");
  const { selectedProducts, resetProductSelection, updateProductSelection, getRecreatedProducts } =
    useRecreateOrder();

  const { allOrders, orderTypes } = useOrderHistory({ customer });

  if (!orderTypes.some(({ orders }) => orders && orders.length > 0)) {
    return <p className="text-2xl text-center">Nessun ordine registrato</p>;
  }

  const handleAccordionChange = (value: string) => {
    if (!onCreate) return;
    if (!value) return resetProductSelection();

    const [orderType, orderIdString] = value.split("-");
    const selectedOrderType = orderTypes.find((type) => type.type === orderType);
    const selectedOrder = selectedOrderType?.orders.find(
      (order) => order.id === Number(orderIdString)
    );

    (selectedOrder?.order.products || []).map(updateProductSelection);
  };

  return (
    <div className="w-full h-full flex flex-col gap-4">
      <Tabs
        defaultValue={"orders"}
        value={currentTab}
        onValueChange={setCurrentTab}
        className="w-full h-full"
      >
        <TabsList className="w-full grid grid-cols-2 mb-4">
          <TabsTrigger value="orders">Ordini</TabsTrigger>
          <TabsTrigger value="stats" disabled={noStatistics}>
            Statistiche
          </TabsTrigger>
        </TabsList>

        {/* Animated Orders tab */}
        <AnimatedTabsContent value="orders" currentValue={currentTab}>
          <Accordion
            onValueChange={handleAccordionChange}
            type="single"
            collapsible
            className="max-h-[35rem] overflow-y-auto px-4 "
          >
            {orderTypes.map(({ type, orders }) =>
              orders
                .sort(
                  (a, b) =>
                    new Date(b.order.created_at).getTime() - new Date(a.order.created_at).getTime()
                )
                .map(({ id, order }) => (
                  <DetailAccordionItem
                    key={id}
                    type={type}
                    id={id}
                    order={order}
                    onCheckboxChange={updateProductSelection}
                    onCreate={onCreate}
                    selectedProducts={selectedProducts}
                    getRecreatedProducts={getRecreatedProducts}
                  />
                ))
            )}
          </Accordion>
        </AnimatedTabsContent>

        {/* Animated Stats tab */}
        {!noStatistics && (
          <AnimatedTabsContent value="stats" currentValue={currentTab}>
            <div className="max-h-[35rem] overflow-y-auto px-4 pb-4">
              <StatsHistoryItem allOrders={allOrders} owner={customer.phone.phone} />
            </div>
          </AnimatedTabsContent>
        )}
      </Tabs>
    </div>
  );
}
