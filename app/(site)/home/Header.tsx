import { useEffect } from "react";
import Actions from "../home/Actions";
import { useWasabiContext } from "../orders/WasabiContext";
import RiceSummary from "../rice/RiceSummary";

export default function Header() {
  const { fetchRice } = useWasabiContext();

  useEffect(fetchRice, []);

  return (
    <>
      <Actions />
      <RiceSummary />
    </>
  );
}
