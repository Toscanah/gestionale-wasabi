import { DateRange } from "react-day-picker";
import { SelectionProps, WeekdaysSelection } from "../Section";
import { DATE_PRESETS, DatePreset } from "@/app/(site)/lib/shared/enums/DatePreset";
import { endOfMonth, endOfYear, startOfDay, startOfMonth, startOfYear, subDays } from "date-fns";
import CalendarFilter from "@/app/(site)/components/ui/filters/calendar/CalendarFilter";

export default function RangeSelection({ selection, dispatch }: SelectionProps<WeekdaysSelection>) {
  const handlePresetSelect = (value: DatePreset) => {
    const today = new Date();
    let newRange: DateRange;

    switch (value) {
      case DatePreset.TODAY:
        newRange = { from: startOfDay(today), to: startOfDay(today) };
        break;
      case DatePreset.YESTERDAY:
        const yesterday = subDays(today, 1);
        newRange = { from: startOfDay(yesterday), to: startOfDay(yesterday) };
        break;
      case DatePreset.LAST_7:
        newRange = { from: startOfDay(subDays(today, 6)), to: startOfDay(today) };
        break;
      case DatePreset.LAST_30:
        newRange = { from: startOfDay(subDays(today, 29)), to: startOfDay(today) };
        break;
      case DatePreset.THIS_MONTH:
        newRange = { from: startOfMonth(today), to: endOfMonth(today) };
        break;
      case DatePreset.THIS_YEAR:
        newRange = { from: startOfYear(today), to: endOfYear(today) };
        break;
      default:
        return;
    }

    dispatch({
      type: "SET_WEEKDAYS_SELECTION",
      payload: { range: newRange },
    });
  };

  return (
    <CalendarFilter
      mode="range"
      dateFilter={selection.type == "range" ? selection.range : undefined}
      presets={DATE_PRESETS}
      handlePresetSelection={(newRange) => handlePresetSelect(newRange as DatePreset)}
      handleDateFilter={(newRange) =>
        dispatch({
          type: "SET_WEEKDAYS_SELECTION",
          payload: { range: newRange as DateRange },
        })
      }
    />
  );
}
