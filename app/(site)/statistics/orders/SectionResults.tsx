import { Separator } from "@/components/ui/separator";
import React from "react";
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
  return (
    <>
      <Separator orientation="horizontal" />

      <table className="w-[20rem]">
        <tbody>
          <tr>
            <td className="py-2">Ordini a Casa</td>
            <td className="py-2 text-right">{homeOrders}</td>
          </tr>
          <tr>
            <td className="py-2">Ordini Ritiro</td>
            <td className="py-2 text-right">{pickupOrders}</td>
          </tr>
          <tr>
            <td className="py-2">Ordini al Tavolo</td>
            <td className="py-2 text-right">{tableOrders}</td>
          </tr>
          <tr>
            <td className="py-2">Riso Consumato</td>
            <td className="py-2 text-right">{formatRice(totalRiceConsumed)}</td>
          </tr>
        </tbody>
      </table>
    </>
  );
}
