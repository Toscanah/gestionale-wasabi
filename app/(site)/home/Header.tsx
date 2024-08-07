import { useEffect, useState } from "react";
import Actions from "../home/Actions";
import { useWasabiContext } from "../components/WasabiContext";
import RiceSummary from "../rice/RiceSummary";

export default function Header() {
  const { fetchRice } = useWasabiContext();

  useEffect(() => {
    fetchRice();
  }, []);

  return (
    <>
      <Actions />
      <RiceSummary />
    </>
  );
}
