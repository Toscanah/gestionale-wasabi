import { Button } from "@/components/ui/button";

export default function Actions({ deleteRows }: { deleteRows: () => void }) {
  return (
    <div className="h-full w-[20%] flex flex-col justify-between items-center *:w-full [&_button]:">
      <Button>Dividi ordine</Button>

      <div className="flex justify-between gap-4">
        <Button
          variant={"outline"}
          className="border border-destructive text-destructive w-1/2"
        >
          Cancella ordine
        </Button>
        <Button className="w-1/2">Conferma ordine</Button>
      </div>

      
    </div>
  );
}
