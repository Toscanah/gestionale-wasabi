import { AnyOrder } from "@/app/(site)/types/PrismaOrders";
import { ProductInOrderType } from "@/app/(site)/types/ProductInOrderType";
import getTable from "@/app/(site)/util/functions/getTable";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Table from "@/app/(site)/components/table/Table";
import getColumns from "./getColumns";
import { OrderType } from "@prisma/client";
import { Button } from "@/components/ui/button";
import OrderPayment from "@/app/(site)/payments/order/OrderPayment";
import { PayingAction } from "../single-order/OrderTable";
import { getProductPrice } from "../../util/functions/getProductPrice";

export default function DivideOrder({
  products,
  order,
  setPayingAction,
  setProducts,
}: {
  products: ProductInOrderType[];
  order: AnyOrder;
  setPayingAction: Dispatch<SetStateAction<PayingAction>>;
  setProducts: Dispatch<SetStateAction<ProductInOrderType[]>>;
}) {
  const [goPay, setGoPay] = useState<boolean>(false);
  const [leftProducts, setLeftProducts] = useState<ProductInOrderType[]>(products);
  const [rightProducts, setRightProducts] = useState<ProductInOrderType[]>([]);

  const columns = getColumns(order.type as OrderType);
  const leftTable = getTable({ data: leftProducts, columns });
  const rightTable = getTable({ data: rightProducts, columns });

  const handleRowClick = (
    product: ProductInOrderType,
    source: ProductInOrderType[],
    setSource: Dispatch<SetStateAction<ProductInOrderType[]>>,
    target: ProductInOrderType[],
    setTarget: Dispatch<SetStateAction<ProductInOrderType[]>>
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

      const targetProduct = targetCopy.find((p) => p.id === product.id);
      if (targetProduct) {
        targetProduct.quantity += 1;
      } else {
        targetCopy.push({ ...product, quantity: 1 });
      }

      setSource(sourceCopy);
      setTarget(targetCopy);
    }
  };

  const handleOrderPaid = () => {
    setRightProducts([]);

    const isOrderFullyPaid = leftProducts.length === 0;
    setPayingAction(isOrderFullyPaid ? "paidFull" : "payPart");

    if (!isOrderFullyPaid) setGoPay(false);
  };

  return !goPay ? (
    <div className="w-full h-full flex flex-col gap-8">
      <div className="w-full h-full flex gap-8">
        <Table<ProductInOrderType>
          tableClassName="max-w-[50%] overflow-x-scroll select-none max-h-full"
          table={leftTable}
          onRowClick={(product) =>
            handleRowClick(product, leftProducts, setLeftProducts, rightProducts, setRightProducts)
          }
        />
        <Table<ProductInOrderType>
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
          onClick={() => {
            setPayingAction("payPart");
            setGoPay(true);
          }}
          className="w-1/2 bg-green-500 text-black"
          disabled={rightProducts.length <= 0}
        >
          Paga
        </Button>
      </div>
    </div>
  ) : (
    <OrderPayment
      setProducts={setProducts}
      type="partial"
      order={{
        ...order,
        products: rightProducts,
        total: rightProducts.reduce(
          (total, p) => total + getProductPrice(p, order.type as OrderType) * p.quantity,
          0
        ),
      }}
      handleBackButton={() => setGoPay(false)}
      handleOrderPaid={handleOrderPaid}
    />
  );
}
