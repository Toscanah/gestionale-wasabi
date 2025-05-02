import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Trash } from "@phosphor-icons/react";
import { Engagement, EngagementType } from "@prisma/client";
import DialogWrapper from "../../components/ui/dialog/DialogWrapper";
import capitalizeFirstLetter from "../../lib/formatting-parsing/capitalizeFirstLetter";
import getEngagementName from "../../lib/formatting-parsing/engagement/getEngagementName";
import { CommonPayload, DraftImagePayload, QrPayload } from "../../shared";
import Link from "next/link";

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("it-IT", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(new Date(date));

const DeleteEngagementDialog = ({
  engagement,
  onDelete,
}: {
  engagement: Engagement;
  onDelete: () => void;
}) => (
  <DialogWrapper
    trigger={
      <Button variant="ghost" size="icon">
        <Trash size={20} />
      </Button>
    }
    variant="delete"
    onDelete={onDelete}
    putSeparator
  >
    <span>
      Sei sicuro di eliminare questa azione di marketing? Questa operazione è irreversibile.
    </span>
  </DialogWrapper>
);

const EngagementContent = ({ engagement }: { engagement: Engagement }) => (
  <>
    <span>
      Messaggio sopra:{" "}
      {(engagement.payload as CommonPayload)?.textAbove || "Nessun messaggio sopra presente"}
    </span>

    {engagement.type === EngagementType.QR_CODE && (
      <span>
        URL:{" "}
        <Link href={(engagement.payload as QrPayload)?.url}>
          {(engagement.payload as QrPayload)?.url || "Nessun URL presente"}
        </Link>
      </span>
    )}

    {engagement.type === EngagementType.IMAGE && (
      <span>
        URL immagine: // TODO: Implement image rendering
        {(engagement.payload as DraftImagePayload)?.imageUrl || "Nessun URL immagine presente"}
      </span>
    )}

    <span>
      Messaggio sotto:{" "}
      {(engagement.payload as CommonPayload)?.textBelow || "Nessun messaggio sotto presente"}
    </span>
  </>
);

export default function PrevEngagement({ engagement }: { engagement: Engagement[] }) {
  const deleteEngagement = (engagement: Engagement) => {
    // fetchRequest("DELETE", "/api/engagements", "deleteEngagement", { id: engagement.id });
  };

  return (
    <DialogWrapper
      trigger={
        <Button data-no-row-click onClick={(e) => e.stopPropagation()}>
          Vedi
        </Button>
      }
      title="Azioni di marketing precedenti"
      // putSeparator
    >
      <Accordion type="multiple" className="w-full max-h-[20rem] overflow-y-auto">
        {engagement.length > 0 ? (
          engagement.map((eng) => (
            <AccordionItem key={eng.id} value={`engagement-${eng.id}`}>
              <AccordionTrigger>
                <div className="flex justify-between items-center w-full">
                  <span className="font-bold">{getEngagementName(eng)}</span>
                  <span className="text-sm text-muted-foreground mr-2">
                    {capitalizeFirstLetter(formatDate(eng.created_at).replace(", ", " alle "))}
                  </span>
                </div>
              </AccordionTrigger>

              <AccordionContent className="flex flex-col gap-2 items-start">
                <EngagementContent engagement={eng} />

                {/* <DeleteEngagementDialog engagement={eng} onDelete={() => deleteEngagement(eng)} /> */}
              </AccordionContent>
            </AccordionItem>
          ))
        ) : (
          <div className="w-full text-center py-4 text-sm text-muted-foreground">
            Nessuna azione di marketing precedente per questo cliente
          </div>
        )}
      </Accordion>
    </DialogWrapper>
  );
}
