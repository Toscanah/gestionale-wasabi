import { Separator } from "@/components/ui/separator";
import React from "react";
import formatRice from "../../functions/formatting-parsing/formatRice";

interface SectionResultsProps {
  homeOrders: number;
  pickupOrders: number;
  tableOrders: number;
  totalRiceConsumed: number;
  // avgPerHour: number;
}

export default function SectionResults({
  homeOrders,
  pickupOrders,
  tableOrders,
  totalRiceConsumed,
  // avgPerHour,
}: SectionResultsProps) {
  return (
    <>
      <Separator orientation="horizontal" />

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
    </>
  );
}
