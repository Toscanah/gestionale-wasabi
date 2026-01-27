import { endOfDay, startOfDay } from "date-fns";
import { DateRange } from "react-day-picker";

const TODAY_PERIOD: DateRange = {
  from: startOfDay(new Date()),
  to: endOfDay(new Date()),
};

export default TODAY_PERIOD;
