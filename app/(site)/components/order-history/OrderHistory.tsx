import {
  CustomerWithDetails,
  HomeOrderWithOrder,
  PickupOrderWithOrder,
} from "@/app/(site)/lib/shared";
import { Accordion } from "@/components/ui/accordion";
import { ProductInOrder } from "@/app/(site)/lib/shared";
import StatsAccordionItem from "./StatsAccordionItem";
import useRecreateOrder from "../../hooks/order/history/useRecreateOrder";
import useOrderHistory from "../../hooks/order/history/useOrderHistory";
import DetailAccordionItem from "./DetailAccordionItem";

interface OrderHistoryProps {
  customer: CustomerWithDetails;
  onCreate?: (newProducts: ProductInOrder[]) => void;
  noStatistics?: boolean;
}

export type PossibleOrder = HomeOrderWithOrder | PickupOrderWithOrder;

export default function OrderHistory({ customer, onCreate, noStatistics }: OrderHistoryProps) {
  const { selectedProducts, resetProductSelection, updateProductSelection, getRecreatedProducts } =
    useRecreateOrder();

  const { allOrders, orderTypes } = useOrderHistory({ customer });

  if (!orderTypes.some(({ orders }) => orders && orders.length > 0)) {
    return <p className="text-2xl text-center">Nessun ordine registrato</p>;
  }

  const onAccordionChange = (value: string) => {
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
      <Accordion
        onValueChange={onAccordionChange}
        type="single"
        collapsible
        className="max-h-[450px] overflow-y-auto overflow-x-hidden pr-4"
      >
        {!noStatistics && <StatsAccordionItem allOrders={allOrders} />}

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
    </div>
  );
}
