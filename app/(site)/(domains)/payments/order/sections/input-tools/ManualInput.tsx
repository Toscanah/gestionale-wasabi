import { useOrderPaymentContext } from "@/context/OrderPaymentContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Backspace, BackspaceIcon } from "@phosphor-icons/react";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";

export default function ManualInput() {
  const { typedAmount, setTypedAmount } = useOrderPaymentContext();

  const calcRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = (value: string) => {
    setTypedAmount((prev) => {
      if (document.getSelection()?.toString() === calcRef.current?.value.toString()) {
        if (value === "erase") return "";
        if (value === ".") return "0.";
        if (value !== ".") return value;
        return prev;
      }

      // Default behavior when the input is not focused
      if (value === "erase") return prev.slice(0, -1);
      if (value === "." && !prev.includes(".")) return prev === "" ? "0." : prev + value;
      if (value !== ".") return prev + value;
      
      return prev;
    });

    calcRef.current?.focus();
  };

  useEffect(() => {
    calcRef.current?.focus();
    calcRef.current?.select();
  }, []);

  const buttons = ["7", "8", "9", "4", "5", "6", "1", "2", "3", "0", "."];

  return (
    <>
      <Input
        onClick={() => calcRef.current?.select()}
        ref={calcRef}
        className="w-64 h-12 text-xl"
        value={typedAmount}
        type="text"
        onChange={(e) => setTypedAmount(e.target.value)}
      />

      <div className="grid grid-cols-3 gap-4 *:border ">
        {buttons.map((value, index) => (
          <Button
            key={index}
            className={`h-16 w-16 text-4xl`}
            onClick={() => handleButtonClick(value)}
          >
            {value}
          </Button>
        ))}

        <Button
          key={"erase"}
          className={`h-16 w-16 text-4xl p-0`}
          onClick={() => handleButtonClick("erase")}
        >
          <BackspaceIcon size={48} weight="regular" />
        </Button>
      </div>
    </>
  );
}
