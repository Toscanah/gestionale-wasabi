import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogHeader,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Plus } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function PhoneDialog() {
  const [phone, setPhone] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const router = useRouter();

  const sendToCustomerPage = () => {
    router.push(`../customer/?phone=${encodeURIComponent(phone)}`);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="rounded-full h-20 w-40">
          <Plus className="h-16 w-16" />
        </Button>
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Numero cliente</DialogTitle>
        </DialogHeader>

        <Input
          placeholder="Numero tel cliente..."
          autoFocus
          className={cn(
            error
              ? "focus-visible:ring-red-600 border-red-600 focus-visible:border-none "
              : "focus-visible:ring-ring"
          )}
          onChange={(e: any) => {
            setError(false);
            setPhone(e.target.value);
          }}
          type="number"
          onKeyDown={(e: any) => {
            if (e.key == "Enter") {
              if (e.target.value !== "") {
                setPhone(e.target.value);
                sendToCustomerPage();
              } else {
                setError(true);
              }
            }
          }}
        />

        <DialogFooter>
          <Button
            type="submit"
            onClick={() => {
              if (phone !== "") {
                sendToCustomerPage();
              } else {
                setError(true);
              }
            }}
          >
            Vai
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
