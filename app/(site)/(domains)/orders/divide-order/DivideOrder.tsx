import { ProductInOrder } from "@/app/(site)/lib/shared";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import OrderPayment from "@/app/(site)/(domains)/payments/order/OrderPayment";
import { PayingAction } from "../single-order/OrderTable";
import { useOrderContext } from "../../../context/OrderContext";
import DivideTable from "./DivideTable";
import moveProductsInDivideOrder from "../../../lib/services/order-management/moveProductsInDivideOrder";
import usePrinter from "@/app/(site)/hooks/printing/usePrinter";
import { OrderStatus, PaymentScope, PlannedPayment } from "@/prisma/generated/client/enums";

interface DividerOrderProps {
  setPayingAction: Dispatch<SetStateAction<PayingAction>>;
  products: ProductInOrder[];
}

export default function DivideOrder({ setPayingAction, products }: DividerOrderProps) {
  const { order, createSubOrder, updatePrintedFlag } = useOrderContext();
  const { printOrder } = usePrinter();
  const { dialogOpen } = useOrderContext();

  const [goPay, setGoPay] = useState<boolean>(false);
  const [leftProducts, setLeftProducts] = useState<ProductInOrder[]>(products);
  const [rightProducts, setRightProducts] = useState<ProductInOrder[]>([]);
  const [productsToPay, setProductsToPay] = useState<ProductInOrder[]>([]);

  useEffect(() => {
    setLeftProducts(products);
  }, [products]);

  useEffect(() => {
    if (order.status === OrderStatus.PAID) {
      setPayingAction("paidFull");
      setGoPay(false);
    }
  }, [order.status]);

  useEffect(() => {
    if (leftProducts.length === 0 && rightProducts.length === 0) {
      setPayingAction("paidFull");
    }
  }, [leftProducts]);

  const handlePayClick = async (products: ProductInOrder[]) => {
    const partialOrder = {
      ...order,
      products,
    };

    setProductsToPay(products);
    setPayingAction("payPart");
    setGoPay(true);

    await printOrder({
      order: partialOrder,
      plannedPayment: PlannedPayment.UNKNOWN,
      putInfo: false,
      forceCut: true,
    });
  };

  const handleOrderPaid = () => {
    setRightProducts([]);

    const updatedRightProducts = rightProducts
      .map((rightProduct) => {
        const paidProduct = productsToPay.find((p) => p.id === rightProduct.id);
        if (paidProduct) {
          const remainingQuantity = rightProduct.quantity - paidProduct.quantity;
          return remainingQuantity > 0 ? { ...rightProduct, quantity: remainingQuantity } : null;
        }
        return rightProduct;
      })
      .filter((product) => product !== null);

    setLeftProducts(leftProducts);
    setRightProducts(updatedRightProducts);

    const isOrderFullyPaid = leftProducts.length === 0 && updatedRightProducts.length === 0;

    setPayingAction(isOrderFullyPaid ? "paidFull" : "payPart");

    if (!isOrderFullyPaid) {
      setGoPay(false);
    }
  };

  useEffect(() => {
    const asyncSubOrder = async (isReceiptPrinted: boolean) => {
      await createSubOrder(order, rightProducts, isReceiptPrinted);
    };

    if (!dialogOpen && rightProducts.length > 0) {
      asyncSubOrder(goPay);
    }
  }, [dialogOpen]);

  const isPayingLeft = productsToPay.every((p) => leftProducts.some((lp) => lp.id === p.id));

  const isPayingRight = productsToPay.every((p) => rightProducts.some((rp) => rp.id === p.id));

  const stage =
    (isPayingLeft && rightProducts.length === 0) || (isPayingRight && leftProducts.length === 0)
      ? "FINAL"
      : "PARTIAL";

  return !goPay ? (
    <div className="w-full h-full flex flex-col gap-8">
      <div className="w-full h-full flex gap-8">
        <DivideTable
          onPayClick={async (products) => {
            await updatePrintedFlag();
            handlePayClick(products);
          }}
          orderType={order.type}
          products={leftProducts}
          disabled={leftProducts.length === 0 || rightProducts.length > 0}
          onRowClick={(product) =>
            moveProductsInDivideOrder(
              product,
              leftProducts,
              setLeftProducts,
              rightProducts,
              setRightProducts
            )
          }
        />

        <DivideTable
          onPayClick={handlePayClick}
          orderType={order.type}
          disabled={rightProducts.length === 0}
          products={rightProducts}
          onRowClick={(product) =>
            moveProductsInDivideOrder(
              product,
              rightProducts,
              setRightProducts,
              leftProducts,
              setLeftProducts
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
      scope={PaymentScope.PARTIAL}
      stage={stage}
      partialOrder={{
        ...order,
        products: productsToPay,
      }}
      onBackButton={() => setGoPay(false)}
      onOrderPaid={handleOrderPaid}
    />
  );
}
