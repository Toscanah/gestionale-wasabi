import { Button } from "@/components/ui/button";

export default function Actions({ deleteRows }: { deleteRows: () => void }) {
  return (
    <div className="h-full w-[20%] flex flex-col justify-between items-center *:h-20 *:w-full [&_button]:text-4xl">
      <Button>Cancella ordine</Button>
      <Button onClick={deleteRows}>Cancella selezionati</Button>
      <Button>Dividi ordine</Button>
      <Button>Chiudi conto</Button>
      <Button>Conferma</Button>
    </div>
  );
}
