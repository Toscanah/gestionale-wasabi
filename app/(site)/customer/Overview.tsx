import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const dummyAddresses = [
  { address: "Via di Romagna", civic: "9/1" },
  { address: "", civic: "" },
];

export default function Overview() {
  return (
    <>
      <div className="w-full h-1/2 p-4 bg-slate-400">
        <div className="w-full flex flex-col">
          <div className="flex gap-2 mb-24 w-3/4 items-center">
            <span>Telefono: </span>
            <Input></Input>
          </div>

          <div className="flex flex-col gap-2">
            {dummyAddresses.map((address, index) => (
              <div key={index} className="flex items-center">
                <div className="w-32">{index + 1 + " domicilio: "} </div>
                {address.address && address.civic ? (
                  <Button variant="outline">
                    {address.address} {address.civic}
                  </Button>
                ) : (
                  <Button>Crea</Button>
                )}
              </div>
            ))}
            <div key={-1} className="flex items-center">
              {
                <>
                  <div className="w-32">Provvisorio:</div> <Button>Crea</Button>
                </>
              }
            </div>
          </div>
        </div>
      </div>
      <Button className="text-4xl h-16">CONFERMA</Button>
    </>
  );
}
