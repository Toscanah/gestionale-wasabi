import { Button } from "@/components/ui/button";
import WasabiDialog from "../../components/ui/dialog/WasabiDialog";
import { AnyOrder, HomeOrder } from "../../lib/shared";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { MessageDirection } from "@prisma/client";
import { cn } from "@/lib/utils";

type MetaLogsProps = {
  order: AnyOrder;
};

export default function MetaLogs({ order }: MetaLogsProps) {
  const parsedOrder: HomeOrder = order as HomeOrder;
  const phone = parsedOrder.home_order?.customer.phone.phone;

  const openWhatsAppChat = () => {
    if (!phone) return;
    const formattedPhone = phone.replace(/\D/g, "");
    const url = `https://wa.me/${formattedPhone}`;
    window.open(url, "_blank");
  };

  const messages = parsedOrder.home_order?.messages;

  return (
    <WasabiDialog
      title="Messaggi inviati/ricevuti"
      trigger={<Button className="!text-background">Vedi</Button>}
    >
      <Accordion type="single">
        {messages && messages.length > 0 ? (
          messages.map((log, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger canOpen={false} className="hover:no-underline cursor-default">
                <div className="w-full justify-between items-center flex">
                  <span className="w-full flex justify-start">
                    #{index + 1}
                    {" - "}
                    {log.template_name}
                    {" - "}
                    {new Date(log.created_at).toLocaleTimeString("it-IT", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    {" - "}
                    {new Date(log.created_at).toLocaleDateString("it-IT", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </span>
                  <Badge
                    className={cn(
                      log.direction === MessageDirection.INBOUND
                        ? "bg-green-500"
                        : "bg-blue-500"
                    )}
                  >
                    {log.direction === MessageDirection.INBOUND ? "Ricevuto" : "Inviato"}
                  </Badge>
                </div>
              </AccordionTrigger>

              {/* <AccordionContent>
              Messaggio inviato: {log.text || "(nessun contenuto)"}
            </AccordionContent> */}
            </AccordionItem>
          ))
        ) : (
          <span className="w-full flex justify-center items-center">
            Nessun messaggio inviato/ricevuto
          </span>
        )}
      </Accordion>

      <Button className="text-2xl h-24" onClick={openWhatsAppChat}>
        Apri Chat Whatsapp
      </Button>
    </WasabiDialog>
  );
}
