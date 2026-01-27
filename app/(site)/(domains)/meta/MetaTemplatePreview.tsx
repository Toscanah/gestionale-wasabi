import React from "react";
import { MetaTemplate, TemplateComponent } from "@/lib/shared";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import extractVariableIndexes from "@/lib/shared/utils/domains/meta/extractVariableIndexes";
import getExampleParams from "@/lib/shared/utils/domains/meta/getExampleParams";
import renderTextWithVariables from "@/lib/services/meta/ui/renderTextWithVariables";
import { ParamType } from "../../../../hooks/meta/useTemplatesParams";
import getStaticHeaderDescription from "@/lib/shared/utils/domains/meta/getStaticHeaderDescription";

type MetaTemplatePreviewProps = {
  template: MetaTemplate;
  getParams: (templateId: string, type: ParamType) => Record<number, string>;
  setParam: (templateId: string, type: ParamType, index: number, value: string) => void;
};

export default function MetaTemplatePreview({
  template,
  getParams,
  setParam,
}: MetaTemplatePreviewProps) {
  const renderVariableInputs = (
    indexes: number[],
    example: string[] | undefined,
    type: ParamType
    // componentIndex: number
  ) => {
    const values = getParams(template.id, type);

    return (
      <div className="mt-2 space-y-1">
        {indexes.map((i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-sm font-mono text-red-500 font-bold">{`{{${i}}}`}</span>
            <Input
              className="w-64"
              placeholder={example?.[i - 1] ?? `Parametro ${i}`}
              value={values[i] ?? ""}
              onChange={(e) => setParam(template.id, type, i, e.target.value)}
            />
          </div>
        ))}
      </div>
    );
  };

  const renderComponent = (component: TemplateComponent, index: number) => {
    switch (component.type) {
      case "HEADER":
        return (
          <div>
            <strong>Intestazione</strong>
            {component.format === "TEXT" && (
              <>
                <div className="whitespace-pre-wrap">{renderTextWithVariables(component.text)}</div>
                {renderVariableInputs(
                  extractVariableIndexes(component.text),
                  getExampleParams("header_text", component.example),
                  "header_text"
                )}
              </>
            )}
            {component.format !== "TEXT" && <p>{getStaticHeaderDescription(component.format)}</p>}
          </div>
        );

      case "BODY":
        return (
          <div>
            <strong>Corpo</strong>
            <div className="whitespace-pre-wrap">{renderTextWithVariables(component.text)}</div>
            {renderVariableInputs(
              extractVariableIndexes(component.text),
              getExampleParams("body_text", component.example),
              "body_text"
            )}
          </div>
        );

      case "FOOTER":
        return (
          <div>
            <strong>Piè di pagina</strong>
            <div className="whitespace-pre-wrap">{renderTextWithVariables(component.text)}</div>
          </div>
        );

      case "BUTTONS":
        return (
          <div>
            <strong>Pulsanti</strong>
            <ul className="space-y-2">
              {component.buttons.map((button, btnIndex) => {
                const indexes = extractVariableIndexes(button.text);
                return (
                  <li key={btnIndex}>
                    <div>
                      {button.type === "QUICK_REPLY" && `[Risposta Rapida] ${button.text}`}
                      {button.type === "URL" && `[Link] ${button.text} → ${button.url}`}
                      {button.type === "PHONE_NUMBER" &&
                        `[Chiamata] ${button.text} → ${button.phone_number}`}
                    </div>
                    {indexes.length > 0 && (
                      <div className="mt-1 ml-4">
                        {renderVariableInputs(
                          indexes,
                          button.type === "URL" && button.example ? [button.example] : undefined,
                          "button_url"
                        )}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        {template.components.map((component, index) => (
          <React.Fragment key={index}>
            {renderComponent(component, index)}
            {index < template.components.length - 1 && <Separator />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
