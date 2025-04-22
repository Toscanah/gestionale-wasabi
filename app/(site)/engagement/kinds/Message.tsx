import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Message() {
  return (
    <div className="w-full flex flex-col space-y-2">
      <Label htmlFor="msg">Messaggio</Label>
      <Input id="msg" className="w-full" />
    </div>
  );
}
