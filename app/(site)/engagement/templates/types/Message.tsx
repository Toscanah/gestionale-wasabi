import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface MessageProps {
  onChange: (value: string) => void;
  value: string;
}

export default function Message({ onChange, value }: MessageProps) {
  return (
    <div className="w-full flex flex-col space-y-2">
      <Label htmlFor="msg">Messaggio</Label>
      <Input id="msg" className="w-full" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
