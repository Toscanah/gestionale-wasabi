import { Engagement, EngagementType, OrderType } from "@prisma/client";
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
import { CommonPayload, CreateEngagement, HomeOrder, PickupOrder, QrPayload } from "../shared";

type CreateEngagementDialogProps = {
  trigger: DialogWrapperProps["trigger"];
  onSuccess: (engagement: CreateEngagement) => void;
} & UseCreateEngagementParams;

function dedupeEngagements(engagements: Engagement[]): Engagement[] {
  const seen = new Set<number>();
  return engagements.filter((engagement) => {
    if (seen.has(engagement.id)) return false;
    seen.add(engagement.id);
    return true;
  });
}

export default function EngagementDialog({
  trigger,
  order,
  customerIds,
}: CreateEngagementDialogProps) {
  const isOrderContext = !!order;

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
    const basePayload: CommonPayload = { textAbove, textBelow };

    let fullPayload: CreateEngagement["payload"];
    switch (choice) {
      case EngagementType.QR_CODE:
        fullPayload = { ...basePayload, url: "https://example.com" };
        break;
      case EngagementType.IMAGE:
        fullPayload = { ...basePayload, imageUrl: "https://example.com/image.jpg" };
        break;
      case EngagementType.MESSAGE:
        fullPayload = { ...basePayload, message: "Some message here" };
        break;
      default:
        throw new Error("Invalid engagement type");
    }

    console.log(fullPayload);

    await createEngagement(fullPayload);
  };

  const activeEngagements = isOrderContext
    ? dedupeEngagements([
        ...(order?.engagement ?? []),
        ...(order.type == OrderType.HOME
          ? (order as HomeOrder).home_order?.customer.engagement ?? []
          : []),
        ...(order.type == OrderType.PICKUP
          ? (order as PickupOrder).pickup_order?.customer?.engagement ?? []
          : []),
      ])
    : [];

  return (
    <DialogWrapper trigger={trigger}>
      <Accordion type="multiple" className="w-full">
        {/* Create new engagement */}
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

        {/* Show existing only in order context */}
        {isOrderContext &&
          activeEngagements.map((engagement, index) => {
            const { payload, type } = engagement;
            const { textAbove = "Nessuno", textBelow = "Nessuno" } = payload as CommonPayload;
            const url = (payload as QrPayload)?.url;

            return (
              <AccordionItem key={engagement.id} value={`active-${index}`}>
                <AccordionTrigger>Marketing attivo #{index + 1}</AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col gap-4">
                    <div>
                      <strong>Tipo:</strong> {getEngagementName(engagement)}
                    </div>

                    <div className="flex flex-col gap-2 items-center justify-center">
                      <div className="text-center text-xl">
                        <strong>Testo sopra:</strong> {textAbove}
                      </div>

                      {type === EngagementType.QR_CODE && url && (
                        <div className="text-center text-2xl">
                          <strong>Link:</strong>{" "}
                          <a
                            href={url}
                            className="text-blue-600 underline hover:text-blue-500 visited:text-purple-600"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {url}
                          </a>
                        </div>
                      )}

                      <div className="text-center text-xl">
                        <strong>Testo sotto:</strong> {textBelow}
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
      </Accordion>
    </DialogWrapper>
  );
}
