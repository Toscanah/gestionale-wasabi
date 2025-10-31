import { DATE_FILTERING_PRESETS, DatePreset } from "@/app/(site)/lib/shared";
import getDateRangeFromPreset from "@/app/(site)/lib/utils/global/date/getDateRangeForPreset";
import { RangeModeProps } from "../CalendarFilter";
import { ArrowsOutLineHorizontalIcon } from "@phosphor-icons/react";
import WasabiSelect from "../../../wasabi/WasabiSelect";

interface DatePresetsProps {
  handleDateFilter: RangeModeProps["handleDateFilter"];
  triggerClassName?: string;
}

export default function DatePresets({ handleDateFilter, triggerClassName }: DatePresetsProps) {
  const handlePresetChange = (preset: string) => {
    handleDateFilter(getDateRangeFromPreset(preset as DatePreset));
  };

  const GROUPS = [
    {
      options: DATE_FILTERING_PRESETS.map((preset) => ({
        label: preset.name,
        value: preset.value,
      })),
    },
  ];

  return (
    <WasabiSelect
      searchPlaceholder="Cerca intervallo"
      triggerIcon={ArrowsOutLineHorizontalIcon}
      shouldSort={false}
      appearance="filter"
      mode="transient"
      triggerClassName={triggerClassName}
      title="Intervalli"
      onChange={handlePresetChange}
      groups={GROUPS}
    />
  );
}
