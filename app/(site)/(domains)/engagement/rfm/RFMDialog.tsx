import DialogWrapper from "@/app/(site)/components/ui/dialog/DialogWrapper";
import { useWasabiContext } from "@/app/(site)/context/WasabiContext";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { HashStraight } from "@phosphor-icons/react";
import { RFM } from "@/app/(site)/lib/shared/types/RFM";
import RFMDimensionEditor from "./edit/RFMDimensionEditor";

export const RFM_LABELS: { key: keyof RFM; label: string }[] = [
  { key: "recency", label: "Recenza" },
  { key: "frequency", label: "Frequenza" },
  { key: "monetary", label: "Monetario" },
];

export default function RFMDialog() {
  const { rfmRules, updateDimensionRules, updateWeight } = useWasabiContext();

  return (
    <DialogWrapper
      autoFocus={false}
      trigger={
        <SidebarMenuButton className="hover:cursor-pointer">
          <HashStraight /> Indice RFM
        </SidebarMenuButton>
      }
    >
      <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
        {RFM_LABELS.map((item) => (
          <AccordionItem key={item.key} value={`${item.key}`}>
            <AccordionTrigger className="flex items-center">
              <span>
                <strong>{item.label[0].toUpperCase()}</strong>
                {" - "}
                {item.label}
              </span>
            </AccordionTrigger>

            <AccordionContent className="flex flex-col gap-4 text-balance">
              <RFMDimensionEditor
                key={item.key}
                dimensionKey={item.key}
                config={rfmRules[item.key]}
                onUpdateRules={updateDimensionRules}
                onUpdateWeight={updateWeight}
              />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </DialogWrapper>
  );
}
