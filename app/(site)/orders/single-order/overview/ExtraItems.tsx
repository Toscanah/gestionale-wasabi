import { useOrderContext } from "@/app/(site)/context/OrderContext";
import fetchRequest from "@/app/(site)/functions/api/fetchRequest";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

interface CounterProps {
  label: string;
  value: number;
  onValueChange: (newValue: number) => void;
}

const Counter = ({ label, value, onValueChange }: CounterProps) => (
  <>
    <Label>{label}</Label>
    <Button className="h-12 w-12" variant="outline" onClick={() => onValueChange(value + 1)}>
      -1
    </Button>
    <Input value={value} onChange={(e) => onValueChange(e.target.valueAsNumber)} className="h-12" />
    <Button className="h-12 w-12" variant="outline" onClick={() => onValueChange(value + 1)}>
      +1
    </Button>
  </>
);

export default function ExtraItems() {
  const [salads, setSalads] = useState<number>(0);
  const [soups, setSoups] = useState<number>(0);
  const [rices, setRices] = useState<number>(0);
  const { order } = useOrderContext();

  const fetchSoupsAndSalads = () => fetchRequest;

  const onSaladsChange = (newSalads: number) => setSalads(newSalads);
  const onSoupsChange = (newSoups: number) => setSoups(newSoups);

  return (
    <div className="h-12 w-full flex space-x-2 items-center">
      <Counter label="Zuppe" value={salads} onValueChange={onSaladsChange} />
      <Separator orientation="vertical" className="space-x-6" />
      <Counter label="Insalate" value={soups} onValueChange={onSoupsChange} />
    </div>
  );
}
