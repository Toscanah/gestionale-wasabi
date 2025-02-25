import DialogWrapper from "../components/dialog/DialogWrapper";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toastError } from "../functions/util/toast";

interface EmailSenderProps {
  subject: string;
  body: string | null;
  isDisabled: boolean;
}

export default function EmailSender({
  subject: receivedSubject,
  body: receivedBody,
  isDisabled,
}: EmailSenderProps) {
  const [emails, setEmails] = useState("");
  const [subject, setSubject] = useState(receivedSubject || "");
  const [body, setBody] = useState(receivedBody || "");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setEmails("");
  }, [open]);

  useEffect(() => {
    setSubject(receivedSubject || "");
    setBody(receivedBody || "");
  }, [receivedSubject, receivedBody]);

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const sendEmails = () => {
    const emailList = emails
      .split(/,\s*|\n/)
      .map((email) => email.trim())
      .filter((email) => email);

    const uniqueEmails = [...new Set(emailList)];
    const invalidEmails = uniqueEmails.filter((email) => !isValidEmail(email));

    if (uniqueEmails.length === 0) {
      toastError("Inserisci almeno un'email valida");
      return;
    }

    if (invalidEmails.length > 0) {
      toastError("Alcune email non sono valide: " + invalidEmails.join(", "));
      return;
    }

    if (!subject) {
      toastError("Inserisci l'oggetto dell'email", "Oggetto mancante");
      return;
    }

    if (!body) {
      toastError("Inserisci il corpo dell'email", "Corpo mancante");
      return;
    }

    const mailtoLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
      uniqueEmails.join(",")
    )}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.open(mailtoLink, "_blank");
  };

  return (
    <DialogWrapper
      autoFocus={false}
      title="Email ai clienti"
      putSeparator
      open={open}
      onOpenChange={setOpen}
      trigger={<Button disabled={isDisabled}>Invia</Button>}
    >
      <div className="space-y-2">
        <Label>Lista di email (separate da una virgola)</Label>
        <Textarea
          value={emails}
          onChange={(e) => setEmails(e.target.value)}
          className="w-full h-20"
        />
      </div>

      <div className="space-y-2">
        <Label>Oggetto dell'email</Label>
        <Input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full"
          disabled
        />
      </div>

      <div className="space-y-2">
        <Label>Contenuto dell'email</Label>
        <Textarea value={body} onChange={(e) => setBody(e.target.value)} className="w-full h-40" />
      </div>

      <Button onClick={sendEmails} className="w-full">
        Manda email
      </Button>
    </DialogWrapper>
  );
}
