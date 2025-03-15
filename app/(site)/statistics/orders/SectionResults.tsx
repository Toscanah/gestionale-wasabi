import React from "react";

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
    <div className="w-full max-w-2xl p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Risultati Filtri</h2>

      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 px-4 py-2 text-left">Tipologia Ordine</th>
            <th className="border border-gray-300 px-4 py-2 text-right">Quantità</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-gray-300 px-4 py-2">Ordini a Casa</td>
            <td className="border border-gray-300 px-4 py-2 text-right">{homeOrders}</td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2">Ordini Ritiro</td>
            <td className="border border-gray-300 px-4 py-2 text-right">{pickupOrders}</td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2">Ordini al Tavolo</td>
            <td className="border border-gray-300 px-4 py-2 text-right">{tableOrders}</td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2 font-semibold">Riso Consumato (g)</td>
            <td className="border border-gray-300 px-4 py-2 text-right font-semibold">
              {totalRiceConsumed}g
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
