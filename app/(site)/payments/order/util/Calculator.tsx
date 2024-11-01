import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Backspace } from "@phosphor-icons/react";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import CalculationTable from "./CalculationTable";
import formatAmount from "@/app/(site)/util/functions/formatAmount";

export type Calc = { amount: number; quantity: number; total: number };

export default function Calculator({
  typedAmount,
  setTypedAmount,
  handleBackButton,
}: {
  typedAmount: string;
  handleBackButton: () => void;
  setTypedAmount: Dispatch<SetStateAction<string>>;
}) {
  const calcRef = useRef<HTMLInputElement>(null);
  const [calcs, setCalcs] = useState<Calc[]>([{ amount: 0, quantity: 0, total: 0 }]);

  const handleButtonClick = (value: string) => {
    if (value === "erase") {
      setTypedAmount((prev) => prev.slice(0, -1));
    } else if (value === "." && !typedAmount.includes(".")) {
      if (typedAmount === "") {
        setTypedAmount("0.");
      } else {
        setTypedAmount(typedAmount + value);
      }
    } else if (value !== ".") {
      setTypedAmount(typedAmount + value);
    }
  };

  useEffect(() => calcRef.current?.focus(), []);

  const buttons = ["7", "8", "9", "4", "5", "6", "1", "2", "3", "0", "."];

  return (
    <div className="w-full h-full flex gap-4 justify-center">
      <div className="w-full h-full flex flex-col gap-4 justify-evenly items-center">
        <Input
          ref={calcRef}
          className="w-72 h-12 text-xl"
          value={typedAmount}
          type="text"
          onChange={(e) => setTypedAmount(e.target.value)}
        />

        <div className="grid grid-cols-3 gap-4 w-72 *:border ">
          {buttons.map((value, index) => (
            <Button
              key={index}
              className={`h-20 "w-20" text-4xl`}
              onClick={() => handleButtonClick(value)}
            >
              {value}
            </Button>
          ))}
          <Button
            key={"erase"}
            className={`h-20 "w-20" text-4xl`}
            onClick={() => handleButtonClick("erase")}
          >
            <Backspace size={48} weight="regular" />
          </Button>
          <Button className="w-full col-span-3" variant={"outline"}>

            Tabella
          </Button>
        </div>
      </div>

      {/* <div className="w-full h-full flex items-center flex-col gap-4 justify-between">
        <CalculationTable calcs={calcs} setCalcs={setCalcs} />
      </div> */}
    </div>
  );
}
