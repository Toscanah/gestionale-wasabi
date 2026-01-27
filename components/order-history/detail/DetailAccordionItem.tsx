import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { getOrderTotal } from "@/lib/services/order-management/getOrderTotal";
import OrderDetail from "./OrderDetail";
import { Button } from "@/components/ui/button";
import capitalizeFirstLetter from "@/lib/shared/utils/global/string/capitalizeFirstLetter";
import {
  ORDER_TYPE_COLORS,
  ORDER_TYPE_LABELS,
  OrderWithProducts,
  ProductInOrder,
} from "@/lib/shared";
import filterDeletedProducts from "@/lib/services/product-management/filterDeletedProducts";
import { useEffect } from "react";
import { OrderType } from "@/prisma/generated/client/enums";
import toEuro from "@/lib/shared/utils/global/string/toEuro";

type OrderAccordionItemProps = {
  type: OrderType;
  id: number;
  order: OrderWithProducts;
  onCheckboxChange: (pio: ProductInOrder) => void;
  onCreate?: (newProducts: ProductInOrder[]) => void;
  selectedProducts: ProductInOrder[];
  getRecreatedProducts: () => ProductInOrder[];
};

const formatDateWithDay = (dateString: Date) => {
  const formattedDate = new Intl.DateTimeFormat("it-IT", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(dateString));

  return capitalizeFirstLetter(formattedDate);
};

export default function DetailAccordionItem({
  type,
  id,
  order,
  onCheckboxChange,
  onCreate,
  selectedProducts,
  getRecreatedProducts,
}: OrderAccordionItemProps) {
  const sortedProducts = order.products.sort((a, b) => b.quantity - a.quantity);
  const inOrderProducts = filterDeletedProducts(sortedProducts);

  const canCreate = selectedProducts.length > 0;

  const orderDate = formatDateWithDay(order.created_at);
  const orderTotal = getOrderTotal({ order, applyDiscounts: true });
  const orderDiscount = order.discount !== 0 ? <> (sconto {order.discount}%)</> : <></>;

  const OrderRecreation = () =>
    onCreate && (
      <Button
        className="w-full"
        onClick={() => onCreate?.(getRecreatedProducts())}
        disabled={!canCreate}
      >
        Ricrea questo ordine
      </Button>
    );

  return (
    <AccordionItem value={`${type}-${id}`} key={`${type}-${id}`}>
      <AccordionTrigger className="text-2xl">
        <div className="flex gap-4 items-center justify-between">
          <span className="flex items-center gap-2">
            <Badge className={"text-base " + ORDER_TYPE_COLORS[type]}>
              {ORDER_TYPE_LABELS[type]}
            </Badge>
            {orderDate} - {toEuro(orderTotal)}
            {orderDiscount}
          </span>
        </div>
      </AccordionTrigger>

      <AccordionContent className="space-y-4">
        <OrderDetail
          onCheckboxChange={onCheckboxChange}
          onCreate={onCreate}
          sortedProducts={inOrderProducts}
          selectedProducts={getRecreatedProducts()}
        />

        <OrderRecreation />
      </AccordionContent>
    </AccordionItem>
  );
}
