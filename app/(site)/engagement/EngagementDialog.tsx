import { Engagement, EngagementType, OrderType } from "@prisma/client";
import DialogWrapper, { DialogWrapperProps } from "../components/ui/dialog/DialogWrapper";
import TemplateWrapper from "./TemplateWrapper";
import QRCode from "./templates/types/QRCode";
import Image from "./templates/types/Image";
import useCreateEngagement, {
  UseCreateEngagementParams,
} from "../hooks/engagement/useCreateEngagement";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import getTemplateName from "../lib/formatting-parsing/engagement/templates/getTemplateName";
import {
  CommonPayload,
  CreateEngagement,
  HomeOrder,
  DraftImagePayload,
  MessagePayload,
  PickupOrder,
  QrPayload,
  FinalImagePayload,
} from "../shared";
import Message from "./templates/types/Message";
import uploadImage from "../lib/api/uploadImage";
import { toastSuccess } from "../lib/util/toast";
import NextImage from "next/image";

type CreateEngagementDialogProps = {
  trigger: DialogWrapperProps["trigger"];
  onSuccess: (engagement: Engagement[]) => void;
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
  onSuccess,
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

  const { choice, setChoice, payload, setPayload, createEngagement, resetPayload } =
    useCreateEngagement(params);

  const onCreateEngagement = async () => {
    const basePayload: CommonPayload = {
      textAbove: payload.textAbove,
      textBelow: payload.textBelow,
    };

    let fullPayload: CreateEngagement["payload"];
    switch (choice) {
      case EngagementType.QR_CODE:
        fullPayload = { ...basePayload, url: (payload as QrPayload).url };
        break;
      case EngagementType.IMAGE: {
        const imageFile = (payload as DraftImagePayload).imageFile;
        if (!imageFile) {
          throw new Error("Nessun file immagine selezionato");
        }

        const { path: imageUrl } = await uploadImage(imageFile, "engagements");
        fullPayload = {
          ...basePayload,
          imageUrl,
        };
        break;
      }
      case EngagementType.MESSAGE:
        fullPayload = { ...basePayload, message: (payload as MessagePayload).message };
        break;
      default:
        throw new Error("Invalid engagement type");
    }

    await createEngagement(fullPayload)
      .then((res) => onSuccess(Array.isArray(res) ? res : [res]))
      .finally(() => {
        resetPayload();
        toastSuccess("Marketing creato con successo");
      });
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
      <Accordion
        type="multiple"
        className="w-full"
        defaultValue={!isOrderContext ? ["new"] : undefined}
      >
        <AccordionItem value="new">
          <AccordionTrigger>Crea nuovo marketing</AccordionTrigger>
          <AccordionContent className="flex flex-col gap-2">
            
          </AccordionContent>
        </AccordionItem>

        {isOrderContext &&
          activeEngagements.map((engagement, index) => {
            const { payload, type } = engagement;
            const { textAbove = "Nessuno", textBelow = "Nessuno" } = payload as CommonPayload;
            const url = (payload as QrPayload)?.url;
            const imageUrl = (payload as FinalImagePayload)?.imageUrl;
            const message = (payload as MessagePayload)?.message;

            return (
              <AccordionItem key={engagement.id} value={`active-${index}`}>
                <AccordionTrigger>Marketing attivo #{index + 1}</AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col gap-4">
                    <div>
                      <strong>Tipo:</strong> {getTemplateName(engagement)}
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

                      {type === EngagementType.IMAGE && imageUrl && (
                        <NextImage
                          src={imageUrl}
                          alt="Immagine di marketing"
                          width={200}
                          height={200}
                        />
                      )}

                      {type === EngagementType.MESSAGE && message && (
                        <div className="text-center text-2xl">
                          <strong>Messaggio:</strong> {message}
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
