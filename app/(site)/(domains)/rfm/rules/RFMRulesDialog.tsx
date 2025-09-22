import WasabiDialog from "@/app/(site)/components/ui/wasabi/WasabiDialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SidebarMenuSubButton } from "@/components/ui/sidebar";
import { RFMRules } from "@/app/(site)/lib/shared/types/RFM";
import RFMDimensionEditor from "./RFMDimensionEditor";
import useRfmRules from "@/app/(site)/hooks/rfm/useRfmRules";

export const RFM_DIM_LABELS: { key: keyof RFMRules; label: string }[] = [
  { key: "recency", label: "Recenza" },
  { key: "frequency", label: "Frequenza" },
  { key: "monetary", label: "Monetario" },
];

export default function RFMRulesDialog() {
  const { rfmRules, updateDimensionRules, updateWeight } = useRfmRules();

  return (
    <WasabiDialog
      title="Regole RFM"
      putSeparator
      putUpperBorder
      trigger={<SidebarMenuSubButton className="hover:cursor-pointer">Regole</SidebarMenuSubButton>}
    >
      <Accordion type="single" collapsible className="w-full">
        {RFM_DIM_LABELS.map((item) => (
          <AccordionItem key={item.key} value={item.key}>
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
    </WasabiDialog>
  );
}
