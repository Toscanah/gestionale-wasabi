import { EngagementType } from "@prisma/client";
import DialogWrapper, { DialogWrapperProps } from "../components/ui/dialog/DialogWrapper";
import EngagementChoice from "./EngagementChoice";
import EngagementWrapper from "./EngagementWrapper";
import QRCode from "./kinds/QRCode";
import Image from "./kinds/Image";
import useEngagement from "../hooks/useEngagement";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface CreateEngagementDialogProps {
  trigger: DialogWrapperProps["trigger"];
  customerId: number
}

export default function EngagementDialog({ trigger, customerId }: CreateEngagementDialogProps) {
  const { choice, setChoice, setTextAbove, setTextBelow, textAbove, textBelow } = useEngagement(customerId);

  return (
    <DialogWrapper trigger={trigger}>
      <Accordion type="multiple" className="w-full">
        <AccordionItem value="active">
          <AccordionTrigger>Marketing attivo</AccordionTrigger>
          <AccordionContent>TODO:</AccordionContent>
        </AccordionItem>

        <AccordionItem value="new" >
          <AccordionTrigger>Crea nuovo marketing</AccordionTrigger>
          <AccordionContent className="flex flex-col gap-2">
            <EngagementChoice choice={choice} setChoice={setChoice} />

            <EngagementWrapper
              onTextAboveChange={setTextAbove}
              onTextBelowChange={setTextBelow}
              textAbove={textAbove}
              textBelow={textBelow}
            >
              {choice === EngagementType.QR_CODE ? <QRCode /> : <Image />}
            </EngagementWrapper>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </DialogWrapper>
  );
}
