import DialogWrapper from "../components/dialog/DialogWrapper";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toastError } from "../functions/util/toast";
import { MarketingTemplate } from "@prisma/client";
import { CustomerWithMarketing } from "../models";
import fetchRequest from "../functions/api/fetchRequest";
import { DialogClose } from "@/components/ui/dialog";

interface EmailSenderProps {
  selectedTemplate: MarketingTemplate | undefined;
  isDisabled: boolean;
  customers: CustomerWithMarketing[];
}

export default function EmailSender({ selectedTemplate, isDisabled, customers }: EmailSenderProps) {
  const [emails, setEmails] = useState(customers.map((customer) => customer.email).join(", "));
  const [subject, setSubject] = useState(selectedTemplate?.subject || "");
  const [body, setBody] = useState(selectedTemplate?.body || "");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setEmails(customers.map((customer) => customer.email).join(", "));
  }, [customers]);

  useEffect(() => {
    setSubject(selectedTemplate?.subject || "");
    setBody(selectedTemplate?.body || "");
  }, [selectedTemplate]);

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
    sendMarketingToCustomers(customers).then(() => setOpen(false));
  };

  const sendMarketingToCustomers = (customers: CustomerWithMarketing[]) =>
    fetchRequest("POST", "/api/marketing-templates", "sendMarketingToCustomers", {
      customerIds: customers.map((c) => c.id),
      marketingId: selectedTemplate?.id || -1,
    });

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

      <DialogWrapper
        title="Conferma"
        putSeparator
        variant="warning"
        size="medium"
        footer={
          <DialogClose className="w-full flex gap-2">
            <Button className="w-full" variant={"outline"}>
              Indietro
            </Button>
            <Button className="w-full" onClick={sendEmails}>
              Confermo
            </Button>
          </DialogClose>
        }
        trigger={<Button className="w-full">Manda email</Button>}
      >
        <span>
          Dopo aver premuto "Confermo" verrai reindirizzato a Gmail per inviare le email di
          marketing agli indirizzi indicati. Nel frattempo, registreremo queste comunicazioni nel
          sistema, così potrai sempre tenerne traccia. Sei pronto a procedere?
        </span>
      </DialogWrapper>
    </DialogWrapper>
  );
}
