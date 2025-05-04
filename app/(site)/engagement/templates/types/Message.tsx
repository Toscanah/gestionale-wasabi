import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface MessageProps {
  onChange: (value: string) => void;
}

export default function Message({ onChange }: MessageProps) {
  return (
    <div className="w-full flex flex-col space-y-2">
      <Label htmlFor="msg">Messaggio</Label>
      <Input
        id="msg"
        className="w-full"
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
