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
  products: ProductInOrder[];
}

export default function DivideOrder({ setPayingAction, products }: DividerOrderProps) {
  const { order, createSubOrder } = useOrderContext();
  const { dialogOpen } = useOrderContext();

  const [goPay, setGoPay] = useState<boolean>(false);
  const [leftProducts, setLeftProducts] = useState<ProductInOrder[]>(products);
  const [rightProducts, setRightProducts] = useState<ProductInOrder[]>([]);
  const [productsToPay, setProductsToPay] = useState<ProductInOrder[]>([]);

  useEffect(() => {
    setLeftProducts(products);
  }, [products]);

  useEffect(() => {
    if (leftProducts.length === 0 && rightProducts.length === 0) {
      setPayingAction("paidFull");
    }
  }, [leftProducts]);

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
          disabled={leftProducts.length === 0 || rightProducts.length > 0}
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
          disabled={rightProducts.length === 0}
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
