import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Backspace } from "@phosphor-icons/react";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";

interface ManualInputProps {
  typedAmount: string;
  setTypedAmount: Dispatch<SetStateAction<string>>;
}

export default function ManualInput({ typedAmount, setTypedAmount }: ManualInputProps) {
  const calcRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = (value: string) => {
    setTypedAmount((prev) => {
      if (value === "erase") return prev.slice(0, -1);
      if (value === "." && !prev.includes(".")) return prev === "" ? "0." : prev + value;
      if (value !== ".") return prev + value;
      return prev;
    });
  };

  useEffect(() => {
    calcRef.current?.focus();
    calcRef.current?.select();
  }, []);

  const buttons = ["7", "8", "9", "4", "5", "6", "1", "2", "3", "0", "."];

  return (
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
            className={`h-20 w-20 text-4xl`}
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
      </div>
    </div>
  );
}
