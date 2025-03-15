import { DateRange } from "react-day-picker";
import { SelectionProps, WeekdaysSelection } from "../Section";
import CalendarRange from "@/app/(site)/components/calendar/CalendarRange";
import { DATE_PRESETS, DatePreset } from "@/app/(site)/enums/DatePreset";
import { endOfMonth, endOfYear, startOfDay, startOfMonth, startOfYear, subDays } from "date-fns";

export default function RangeSelection({
  selection,
  dispatch,
}: SelectionProps<WeekdaysSelection>) {
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
      case DatePreset.LAST7:
        newRange = { from: startOfDay(subDays(today, 6)), to: startOfDay(today) };
        break;
      case DatePreset.LAST30:
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
    <CalendarRange
      dateFilter={selection.type == "range" ? selection.range : undefined}
      presets={DATE_PRESETS}
      handlePresetSelection={(newRange) => handlePresetSelect(newRange as DatePreset)}
      handleDateFilter={(newRange) =>
        dispatch({
          type: "SET_WEEKDAYS_SELECTION",
          payload: { range: newRange },
        })
      }
    />
  );
}
