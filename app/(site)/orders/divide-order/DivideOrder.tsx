import { ProductInOrder } from "@/app/(site)/models";
import getTable from "@/app/(site)/util/functions/getTable";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Table from "@/app/(site)/components/table/Table";
import getColumns from "./getColumns";
import { OrderType } from "@prisma/client";
import { Button } from "@/components/ui/button";
import OrderPayment from "@/app/(site)/payments/order/OrderPayment";
import { PayingAction } from "../single-order/OrderTable";
import { getProductPrice } from "../../util/functions/getProductPrice";
import print from "../../printing/print";
import OrderReceipt from "../../printing/receipts/OrderReceipt";
import { useOrderContext } from "../../context/OrderContext";
import updateOrderNotes from "../../sql/orders/updateOrderNotes";

interface DividerOrderProps {
  setPayingAction: Dispatch<SetStateAction<PayingAction>>;
  products?: ProductInOrder[];
}

export default function DivideOrder({
  setPayingAction,
  products: propProducts,
}: DividerOrderProps) {
  const { order, createSubOrder, updateOrder } = useOrderContext();
  const { dialogOpen } = useOrderContext();

  const [goPay, setGoPay] = useState<boolean>(false);
  const [leftProducts, setLeftProducts] = useState<ProductInOrder[]>(
    propProducts || order.products
  );
  const [rightProducts, setRightProducts] = useState<ProductInOrder[]>([]);

  const columns = getColumns(order.type as OrderType);
  const leftTable = getTable({ data: leftProducts, columns });
  const rightTable = getTable({ data: rightProducts, columns });

  const handleRowClick = (
    product: ProductInOrder,
    source: ProductInOrder[],
    setSource: Dispatch<SetStateAction<ProductInOrder[]>>,
    target: ProductInOrder[],
    setTarget: Dispatch<SetStateAction<ProductInOrder[]>>
  ) => {
    const sourceCopy = source.map((p) => ({ ...p }));
    const targetCopy = target.map((p) => ({ ...p }));

    const sourceProduct = sourceCopy.find((p) => p.id === product.id);
    if (sourceProduct) {
      if (sourceProduct.quantity > 1) {
        sourceProduct.quantity -= 1;
      } else {
        const index = sourceCopy.findIndex((p) => p.id === product.id);
        sourceCopy.splice(index, 1);
      }
      sourceProduct.total = sourceProduct.quantity * getProductPrice(sourceProduct, order.type); // Adjust total for source
    }

    const targetProduct = targetCopy.find((p) => p.id === product.id);
    if (targetProduct) {
      targetProduct.quantity += 1;
      targetProduct.total = targetProduct.quantity * getProductPrice(targetProduct, order.type); // Adjust total for target
    } else {
      targetCopy.push({ ...product, quantity: 1, total: getProductPrice(product, order.type) }); // Assuming the price is available in the product object
    }

    setSource(sourceCopy);
    setTarget(targetCopy);
  };

  const handleOrderPaid = () => {
    setRightProducts([]);

    const isOrderFullyPaid = leftProducts.length === 0;
    setPayingAction(isOrderFullyPaid ? "paidFull" : "payPart");

    if (!isOrderFullyPaid) setGoPay(false);
  };

  useEffect(() => {
    const asyncSubOrder = async () => await createSubOrder(order, rightProducts);

    if (!dialogOpen && rightProducts.length > 0) {
      setTimeout(asyncSubOrder, 0);
    }
  }, [dialogOpen]);

  return !goPay ? (
    <div className="w-full h-full flex flex-col gap-8">
      <div className="w-full h-full flex gap-8">
        <Table<ProductInOrder>
          tableClassName="max-w-[50%] overflow-x-scroll select-none max-h-full"
          table={leftTable}
          onRowClick={(product) =>
            handleRowClick(product, leftProducts, setLeftProducts, rightProducts, setRightProducts)
          }
        />
        <Table<ProductInOrder>
          tableClassName="max-w-[50%] overflow-x-scroll select-none max-h-full"
          table={rightTable}
          onRowClick={(product) =>
            handleRowClick(product, rightProducts, setRightProducts, leftProducts, setLeftProducts)
          }
        />
      </div>

      <div className="flex gap-8 *:h-14 *:text-xl">
        <Button onClick={() => setPayingAction("none")} className="w-1/2">
          Indietro
        </Button>
        <Button
          onClick={async () => {
            setPayingAction("payPart");
            setGoPay(true);

            await print(() =>
              OrderReceipt(
                {
                  ...order,
                  products: rightProducts,
                  total: rightProducts.reduce(
                    (total, p) => total + getProductPrice(p, order.type) * p.quantity,
                    0
                  ),
                },
                "none",
                false,
                true
              )
            );
          }}
          className="w-1/2 bg-green-500 text-black"
          disabled={rightProducts.length <= 0}
        >
          STAMPA e INCASSA
        </Button>
      </div>
    </div>
  ) : (
    <OrderPayment
      type="partial"
      partialOrder={{
        ...order,
        products: rightProducts,
        total: rightProducts.reduce(
          (total, p) => total + getProductPrice(p, order.type) * p.quantity,
          0
        ),
      }}
      handleBackButton={() => setGoPay(false)}
      onOrderPaid={handleOrderPaid}
    />
  );
}
