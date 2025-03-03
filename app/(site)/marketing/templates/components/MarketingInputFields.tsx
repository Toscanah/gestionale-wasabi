import { MarketingTemplateInput } from "@/app/(site)/models";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dispatch, SetStateAction } from "react";

interface MarketingInputFieldsProps {
  marketingTemplate: MarketingTemplateInput;
  setMarketingTemplate: Dispatch<SetStateAction<MarketingTemplateInput>>;
}

export default function MarketingInputFields({
  marketingTemplate,
  setMarketingTemplate,
}: MarketingInputFieldsProps) {
  return (
    <>
      <div className="w-full space-y-2">
        <Label htmlFor="label">Titolo</Label>
        <Input
          id="label"
          value={marketingTemplate?.label}
          onChange={(e) =>
            setMarketingTemplate((prev) => ({ ...prev, label: String(e.target.value) }))
          }
        />
      </div>

      <div className="w-full space-y-2">
        <Label htmlFor="subject">Oggetto</Label>
        <Input
          id="subject"
          value={marketingTemplate?.subject}
          onChange={(e) =>
            setMarketingTemplate((prev) => ({ ...prev, subject: String(e.target.value) }))
          }
        />
      </div>

      <div className="w-full space-y-2">
        <Label htmlFor="body">Corpo</Label>
        <Textarea
          id="body"
          value={marketingTemplate?.body || ""}
          onChange={(e) =>
            setMarketingTemplate((prev) => ({ ...prev, body: String(e.target.value) }))
          }
        />
      </div>
    </>
  );
}
