import React, { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import logo from "../../../../public/logo.png"; // Update with your actual image path
import formatRice from "../../functions/formatting-parsing/formatRice";

interface SectionResultsProps {
  homeOrders: number;
  pickupOrders: number;
  tableOrders: number;
  totalRiceConsumed: number;
}

export default function SectionResults({
  homeOrders,
  pickupOrders,
  tableOrders,
  totalRiceConsumed,
}: SectionResultsProps) {
  const [isLoading, setIsLoading] = useState(false);

  // Store previous values to compare
  const [prevValues, setPrevValues] = useState({
    homeOrders,
    pickupOrders,
    tableOrders,
    totalRiceConsumed,
  });

  useEffect(() => {
    const hasChanged =
      homeOrders !== prevValues.homeOrders ||
      pickupOrders !== prevValues.pickupOrders ||
      tableOrders !== prevValues.tableOrders ||
      totalRiceConsumed !== prevValues.totalRiceConsumed;

      console.log(hasChanged)

    if (hasChanged) {
      setIsLoading(true);
      setPrevValues({ homeOrders, pickupOrders, tableOrders, totalRiceConsumed });

      // Simulate a loading transition
      const timeout = setTimeout(() => {
        setIsLoading(false);
      }, 500); // adjust duration to taste

      return () => clearTimeout(timeout);
    }
  }, [homeOrders, pickupOrders, tableOrders, totalRiceConsumed]);

  return (
    <>
      <Separator orientation="horizontal" />

      {isLoading ? (
        <div className="w-full h-full flex items-center justify-center py-8">
          <Image src={logo} alt="logo" width={200} height={200} className="animate-spin" />
        </div>
      ) : (
        <table className="w-[20rem] text-lg">
          <tbody>
            <tr>
              <td className="py-2">Ordini domicilio</td>
              <td className="py-2 text-right">{homeOrders}</td>
            </tr>
            <tr>
              <td className="py-2">Ordini asporto</td>
              <td className="py-2 text-right">{pickupOrders}</td>
            </tr>
            <tr>
              <td className="py-2">Ordini tavolo</td>
              <td className="py-2 text-right">{tableOrders}</td>
            </tr>
            <tr>
              <td className="py-2">Riso consumato</td>
              <td className="py-2 text-right">{formatRice(totalRiceConsumed)}</td>
            </tr>
          </tbody>
        </table>
      )}
    </>
  );
}
