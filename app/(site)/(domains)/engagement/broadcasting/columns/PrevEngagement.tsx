import DialogWrapper from "@/app/(site)/components/ui/dialog/DialogWrapper";
import ImageViewer from "@/app/(site)/components/ui/misc/ImageViewer";
import capitalizeFirstLetter from "@/app/(site)/lib/utils/global/string/capitalizeFirstLetter";
import getTemplateName from "@/app/(site)/lib/utils/domains/engagement/getTemplateName";
import {
  CommonPayload,
  EngagementWithDetails,
  ImagePayload,
  MessagePayload,
  QrPayload,
} from "@/app/(site)/lib/shared";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Trash } from "@phosphor-icons/react";
import { Engagement, EngagementType } from "@prisma/client";
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

const EngagementContent = ({ engagement }: { engagement: EngagementWithDetails }) => (
  <>
    <span>
      Messaggio sopra:{" "}
      {(engagement.template.payload as CommonPayload)?.textAbove ||
        "Nessun messaggio sopra presente"}
    </span>

    {engagement.template.type === EngagementType.QR_CODE && (
      <span>
        URL:{" "}
        <Link href={(engagement.template.payload as QrPayload)?.url}>
          {(engagement.template.payload as QrPayload)?.url || "Nessun URL presente"}
        </Link>
      </span>
    )}

    {engagement.template.type === EngagementType.IMAGE && (
      <ImageViewer src={(engagement.template.payload as ImagePayload).imageUrl} />
    )}

    {engagement.template.type === EngagementType.MESSAGE && (
      <span>
        Messaggio:{" "}
        <strong>
          {(engagement.template.payload as MessagePayload)?.message || "Nessun messaggio presente"}
        </strong>
      </span>
    )}

    <span>
      Messaggio sotto:{" "}
      {(engagement.template.payload as CommonPayload)?.textBelow ||
        "Nessun messaggio sotto presente"}
    </span>
  </>
);

export default function PrevEngagement({ engagements }: { engagements: EngagementWithDetails[] }) {
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
        {/* TOODO: should filter out engagement that comes from a suborder otherwise dups might appear*/}
        {engagements.length > 0 ? (
          engagements.map((eng) => (
            <AccordionItem key={eng.id} value={`engagement-${eng.id}`}>
              <AccordionTrigger>
                <div className="flex justify-between items-center w-full">
                  <span className="font-bold">{getTemplateName(eng.template.type)}</span>
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
