import { AnyOrder } from "@/app/(site)/types/PrismaOrders";
import { ProductInOrderType } from "@/app/(site)/types/ProductInOrderType";
import getTable from "@/app/(site)/util/functions/getTable";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Table from "@/app/(site)/components/table/Table";
import getColumns from "./getColumns";
import { OrderType } from "@/app/(site)/types/OrderType";
import { Button } from "@/components/ui/button";
import OrderPayment from "@/app/(site)/payments/order/OrderPayment";
import { Actions } from "../single-order/OrderTable";

export default function DivideOrder({
  products,
  order,
  setAction,
  setProducts,
}: {
  products: ProductInOrderType[];
  order: AnyOrder;
  setAction: Dispatch<SetStateAction<Actions>>;
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

  return !goPay ? (
    <div className="w-full h-full flex flex-col gap-8">
      <div className="w-full h-full flex gap-8">
        <Table
          tableClassName="max-w-[50%] overflow-x-scroll select-none max-h-full"
          table={leftTable}
          onRowClick={(product) =>
            handleRowClick(product, leftProducts, setLeftProducts, rightProducts, setRightProducts)
          }
        />
        <Table
          tableClassName="max-w-[50%] overflow-x-scroll select-none max-h-full"
          table={rightTable}
          onRowClick={(product) =>
            handleRowClick(product, rightProducts, setRightProducts, leftProducts, setLeftProducts)
          }
        />
      </div>
      <div className="flex gap-8 *:h-14 *:text-xl">
        <Button onClick={() => setAction("")} className="w-1/2">
          Indietro
        </Button>
        <Button
          onClick={() => {
            setAction("payPart");
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
          (total, p) =>
            total +
            (order.type == OrderType.TO_HOME ? p.product.home_price : p.product.site_price) *
              p.quantity,
          0
        ),
      }}
      handleBackButton={() => setGoPay(false)}
      handleOrderPaid={() => {
        setRightProducts([]);
        /**
         * questo deve essere piu completo
         * in pratica se è "l'ultima volta" che posso fare il divide,
         * per cui che dopo aver pagato non c'è altro da pagare,
         * non devo usare setGopay(false) ma setAction("paidFull"),
         * cosi dopo aver pagato definitivamente tutto si chiude l'ordine
         */
        setGoPay(false);
      }}
    />
  );
}
