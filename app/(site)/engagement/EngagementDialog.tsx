import { EngagementType } from "@prisma/client";
import DialogWrapper, { DialogWrapperProps } from "../components/ui/dialog/DialogWrapper";
import EngagementChoice from "./EngagementChoice";
import EngagementWrapper from "./EngagementWrapper";
import QRCode from "./types/QRCode";
import Image from "./types/Image";
import useCreateEngagement, {
  UseCreateEngagementParams,
} from "../hooks/engagement/useCreateEngagement";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import getEngagementName from "../lib/formatting-parsing/engagement/getEngagementName";
import { CommonPayload, CreateEngagement } from "../shared";

type CreateEngagementDialogProps = {
  trigger: DialogWrapperProps["trigger"];
} & UseCreateEngagementParams;

export default function EngagementDialog({
  trigger,
  order,
  customerIds,
}: CreateEngagementDialogProps) {
  const params =
    order !== undefined
      ? { order, customerIds }
      : customerIds !== undefined
      ? { customerIds, order }
      : undefined;

  if (!params) {
    throw new Error("Either order or customerIds must be provided");
  }

  const { choice, setChoice, setTextAbove, setTextBelow, textAbove, textBelow, createEngagement } =
    useCreateEngagement(params);

  const onCreateEngagement = async () => {
    const base: CommonPayload = {
      textAbove,
      textBelow,
    };

    let engagement: CreateEngagement;

    if (choice === EngagementType.QR_CODE) {
      console.log("Ok");
      engagement = {
        type: EngagementType.QR_CODE,
        payload: {
          ...base,
          url: "https://example.com",
        },
      };
    } else if (choice === EngagementType.IMAGE) {
      engagement = {
        type: EngagementType.IMAGE,
        payload: {
          ...base,
          imageUrl: "https://example.com/image.jpg",
        },
      };
    } else if (choice === EngagementType.MESSAGE) {
      engagement = {
        type: EngagementType.MESSAGE,
        payload: {
          ...base,
          message: "Some message here",
        },
      };
    } else {
      throw new Error("Invalid engagement type");
    }

    await createEngagement(engagement.payload);
  };

  const activeEngagements = order?.engagement ?? [];

  return (
    <DialogWrapper trigger={trigger}>
      <Accordion type="multiple" className="w-full">
        <AccordionItem value="new">
          <AccordionTrigger>Crea nuovo marketing</AccordionTrigger>
          <AccordionContent className="flex flex-col gap-2">
            <EngagementChoice choice={choice} setChoice={setChoice} />

            <EngagementWrapper
              onTextAboveChange={setTextAbove}
              onTextBelowChange={setTextBelow}
              onCreateEngagement={onCreateEngagement}
              textAbove={textAbove}
              textBelow={textBelow}
            >
              {choice === EngagementType.QR_CODE ? <QRCode /> : <Image />}
            </EngagementWrapper>
          </AccordionContent>
        </AccordionItem>

        {/* Then: Existing active engagements */}
        {activeEngagements.map((engagement, index) => (
          <AccordionItem key={engagement.id} value={`active-${index}`}>
            <AccordionTrigger>Marketing attivo #{index + 1}</AccordionTrigger>
            <AccordionContent>
              {/* Here you can customize how to show each engagement */}
              <div className="flex flex-col gap-1">
                <div>
                  <strong>Tipo:</strong> {getEngagementName(engagement)}
                </div>
                {/* <div>
                  <strong>Testo sopra:</strong> {engagement.textAbove ?? "Nessuno"}
                </div>
                <div>
                  <strong>Testo sotto:</strong> {engagement.textBelow ?? "Nessuno"}
                </div> */}
                {/* Add more fields as needed */}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </DialogWrapper>
  );
}
