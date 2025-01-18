import { ProductInOrder } from "@/app/(site)/models";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import OrderPayment from "@/app/(site)/payments/order/OrderPayment";
import { PayingAction } from "../single-order/OrderTable";
import print from "../../printing/print";
import OrderReceipt from "../../printing/receipts/OrderReceipt";
import { useOrderContext } from "../../context/OrderContext";
import calculateOrderTotal from "../../functions/order-management/calculateOrderTotal";
import DivideTable from "./DivideTable";
import shiftProductsInDivideOrder from "../../functions/order-management/shiftProductsInDivideOrder";

interface DividerOrderProps {
  setPayingAction: Dispatch<SetStateAction<PayingAction>>;
  products?: ProductInOrder[];
}

export default function DivideOrder({
  setPayingAction,
  products: propProducts,
}: DividerOrderProps) {
  const { order, createSubOrder } = useOrderContext();
  const { dialogOpen } = useOrderContext();

  const [goPay, setGoPay] = useState<boolean>(false);
  const [leftProducts, setLeftProducts] = useState<ProductInOrder[]>(
    propProducts || order.products
  );
  const [rightProducts, setRightProducts] = useState<ProductInOrder[]>([]);
  const [productsToPay, setProductsToPay] = useState<ProductInOrder[]>([]);

  const handlePayClick = async (products: ProductInOrder[]) => {
    const partialOrder = {
      ...order,
      products,
      total: calculateOrderTotal({ ...order, products }),
    };

    setProductsToPay(products);
    setPayingAction("payPart");
    setGoPay(true);

    await print(() => OrderReceipt(partialOrder, "none", false, true));
  };

  const handleOrderPaid = () => {
    setRightProducts([]);

    const updatedLeftProducts = leftProducts.filter(
      (leftProduct) => !productsToPay.some((paidProduct) => paidProduct.id === leftProduct.id)
    );

    setLeftProducts(updatedLeftProducts);
    const isOrderFullyPaid = updatedLeftProducts.length === 0;
    setPayingAction(isOrderFullyPaid ? "paidFull" : "payPart");

    if (!isOrderFullyPaid) setGoPay(false);
  };

  useEffect(() => {
    const asyncSubOrder = async (isReceiptPrinted: boolean) =>
      await createSubOrder(order, rightProducts, isReceiptPrinted);

    if (!dialogOpen && rightProducts.length > 0) {
      asyncSubOrder(goPay ? true : false);
    }
  }, [dialogOpen]);

  return !goPay ? (
    <div className="w-full h-full flex flex-col gap-8">
      <div className="w-full h-full flex gap-8">
        <DivideTable
          onPayClick={handlePayClick}
          orderType={order.type}
          products={leftProducts}
          onRowClick={(product) =>
            shiftProductsInDivideOrder(
              product,
              leftProducts,
              setLeftProducts,
              rightProducts,
              setRightProducts,
              order.type
            )
          }
        />

        <DivideTable
          onPayClick={handlePayClick}
          orderType={order.type}
          products={rightProducts}
          onRowClick={(product) =>
            shiftProductsInDivideOrder(
              product,
              rightProducts,
              setRightProducts,
              leftProducts,
              setLeftProducts,
              order.type
            )
          }
        />
      </div>

      <div className="flex gap-8 *:h-14 *:text-xl">
        <Button onClick={() => setPayingAction("none")} className="w-full">
          Indietro
        </Button>
      </div>
    </div>
  ) : (
    <OrderPayment
      type="partial"
      partialOrder={{
        ...order,
        products: productsToPay,
        total: calculateOrderTotal({ ...order, products: productsToPay }),
      }}
      handleBackButton={() => setGoPay(false)}
      onOrderPaid={handleOrderPaid}
    />
  );
}
