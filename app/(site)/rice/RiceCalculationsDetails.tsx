import { Button } from "@/components/ui/button";
import DialogWrapper from "../components/dialog/DialogWrapper";
import { useWasabiContext } from "../context/WasabiContext";
import { RiceDefault } from "../types/RiceDefault";
import { useEffect, useState } from "react";
import formatAmount from "../functions/formatting-parsing/formatAmount";

interface RiceCalculationsDetailsProps {
  riceDefaults: RiceDefault[];
}

export default function RiceCalculationsDetails({ riceDefaults }: RiceCalculationsDetailsProps) {
  const { rice } = useWasabiContext();

  const calculateRicePerDefault = () => {
    if (!rice || riceDefaults.length === 0) return [];
    return riceDefaults.map((defaultEntry) => ({
      ...defaultEntry,
      ricePortion: rice.total.amount / defaultEntry.value,
    }));
  };

  const calculatedRiceDefaults = calculateRicePerDefault();

  return (
    <DialogWrapper
      trigger={<Button variant={"outline"}>Dettagli</Button>}
      title="Dettaglio riso"
      size="small"
    >
      {calculatedRiceDefaults.length > 0 ? (
        <ul className="text-xl space-y-2">
          {calculatedRiceDefaults.map((entry, index) => (
            <li key={index} className="">
              <strong>{entry.label}</strong>: {formatAmount(entry.ricePortion)} unità
            </li>
          ))}
        </ul>
      ) : (
        <div className="w-full text-center text-xl">Nessun valore di default presente!</div>
      )}
    </DialogWrapper>
  );
}
