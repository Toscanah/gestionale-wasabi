import { useWasabiContext } from "../orders/WasabiContext";

export default function RiceSummary() {
  const { rice } = useWasabiContext();

  return (
    <div className="flex items-center justify-center text-3xl">
      Riso rimanente: {rice}g
    </div>
  );
}
