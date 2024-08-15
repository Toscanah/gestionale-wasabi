import { AnyOrder } from "@/app/(site)/types/PrismaOrders";
import { ProductInOrderType } from "@/app/(site)/types/ProductInOrderType";
import getTable from "@/app/(site)/util/functions/getTable";
import { Dispatch, SetStateAction, useState } from "react";
import Table from "@/app/(site)/components/table/Table";
import getColumns from "./getColumns";
import { OrderType } from "@/app/(site)/types/OrderType";

export default function DivideOrder({
  products,
  order,
  setDivide,
}: {
  products: ProductInOrderType[];
  order: AnyOrder;
  setDivide: Dispatch<SetStateAction<boolean>>;
}) {
  const [currentProducts, setCurrentProducts] = useState<ProductInOrderType[]>(products);

  const [leftProducts, setLeftProducts] = useState<ProductInOrderType[]>(currentProducts);
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
    const sourceCopy = [...source];
    const targetCopy = [...target];

    const sourceProduct = sourceCopy.find((p) => p.id === product.id);
    if (sourceProduct) {
      if (sourceProduct.quantity > 1) {
        sourceProduct.quantity -= 1;
      } else {
        const index = sourceCopy.indexOf(sourceProduct);
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

  return (
    <div className="w-full h-full flex gap-8">
      <Table
        tableClassName="max-w--[50%] overflow-x-scroll"
        table={leftTable}
        onRowClick={(product) =>
          handleRowClick(product, leftProducts, setLeftProducts, rightProducts, setRightProducts)
        }
      />
      <Table
        tableClassName="max-w-[50%] overflow-x-scroll"
        table={rightTable}
        onRowClick={(product) =>
          handleRowClick(product, rightProducts, setRightProducts, leftProducts, setLeftProducts)
        }
      />
    </div>
  );
}
