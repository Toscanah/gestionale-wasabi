import { useEffect } from "react";
import Actions from "../home/Actions";
import { useWasabiContext } from "../context/WasabiContext";
import RiceSummary from "../rice/RiceSummary";

export default function Header() {
  return (
    <>
      <Actions />
      <RiceSummary />
    </>
  );
}
