import { DATE_FILTERING_PRESETS, DatePreset } from "@/app/(site)/lib/shared";
import getDateRangeFromPreset from "@/app/(site)/lib/utils/global/date/getDateRangeForPreset";
import { RangeModeProps } from "../CalendarFilter";
import { LightningIcon } from "@phosphor-icons/react";
import WasabiUniversalSelect from "../../../wasabi/WasabiUniversalSelect ";

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
    <WasabiUniversalSelect
      triggerIcon={LightningIcon}
      shouldSort={false}
      appearance="filter"
      mode="transient"
      triggerClassName={triggerClassName}
      title="Date pronte"
      onChange={handlePresetChange}
      groups={GROUPS}
    />
  );
}
