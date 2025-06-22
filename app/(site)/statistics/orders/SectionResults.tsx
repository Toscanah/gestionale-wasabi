import React, { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import formatRice from "../../lib/formatting-parsing/formatRice";
import RandomSpinner from "../../components/ui/misc/RandomSpinner";
import { Results } from "../../hooks/statistics/useOrdersStats";

interface SectionResultsProps {
  results: Results;
}

export default function SectionResults({
  results: {
    homeOrders,
    pickupOrders,
    tableOrders,
    totalRiceConsumed,
    totalProducts,
    totalFromProducts,
  },
}: SectionResultsProps) {
  const [isLoading, setIsLoading] = useState(false);

  // Store previous values to compare
  const [prevValues, setPrevValues] = useState({
    homeOrders,
    pickupOrders,
    tableOrders,
    totalRiceConsumed,
    totalProducts,
    totalFromProducts,
  });

  useEffect(() => {
    const hasChanged =
      homeOrders !== prevValues.homeOrders ||
      pickupOrders !== prevValues.pickupOrders ||
      tableOrders !== prevValues.tableOrders ||
      totalRiceConsumed !== prevValues.totalRiceConsumed ||
      totalProducts !== prevValues.totalProducts ||
      totalFromProducts !== prevValues.totalFromProducts;

    if (hasChanged) {
      setIsLoading(true);
      setPrevValues({
        homeOrders,
        pickupOrders,
        tableOrders,
        totalRiceConsumed,
        totalProducts,
        totalFromProducts,
      });

      // Simulate a loading transition
      const timeout = setTimeout(() => {
        setIsLoading(false);
      }, Math.floor(Math.random() * (500 - 200 + 1)) + 200); // adjust duration to taste

      return () => clearTimeout(timeout);
    }
  }, [homeOrders, pickupOrders, tableOrders, totalRiceConsumed, totalProducts, totalFromProducts]);

  return (
    <>
      <Separator orientation="horizontal" />

      {isLoading ? (
        <RandomSpinner isLoading={isLoading} />
      ) : (
        <div className="grid grid-cols-4 gap-x-12 gap-y-2 text-lg justify-center w-full max-w-3xl">
          <div>Ordini totali</div>
          <div className="text-right">{homeOrders + pickupOrders + tableOrders}</div>

          <div>Riso consumato</div>
          <div className="text-right">{formatRice(totalRiceConsumed)}</div>

          <div>Ordini domicilio</div>
          <div className="text-right">{homeOrders}</div>

          <div>Prodotti cucinati</div>
          <div className="text-right">{totalProducts}</div>

          <div>Ordini asporto</div>
          <div className="text-right">{pickupOrders}</div>

          <div>Totale dai prodotti</div>
          <div className="text-right">{totalFromProducts}</div>

          <div>Ordini tavolo</div>
          <div className="text-right">{tableOrders}</div>

          {/* Empty cells to balance the row */}
          <div></div>
          <div></div>
        </div>
      )}
    </>
  );
}
