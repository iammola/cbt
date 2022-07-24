import { Fragment } from "react";
import useSWR from "swr";
import { isEqual, isToday, isSameMonth, endOfWeek, isWeekend, isSameDay, format } from "date-fns";

import { DateItem } from "./Date";

import type { RouteData } from "types";
import type { EventsRangeGETData } from "types/api";

export const Dates: React.FC<DatesProps> = ({ date, dates }) => {
  const { data: { data: events } = { data: [] } } = useSWR<RouteData<EventsRangeGETData>>(
    dates.length > 1 &&
      `/api/events/range/?from=${dates[0].date.getTime()}&to=${dates[dates.length - 1].date.getTime()}`
  );

  return (
    <Fragment>
      {dates.map((item, idx) => (
        <DateItem
          key={idx}
          today={isToday(item.date)}
          weekend={isWeekend(item.date)}
          lastRow={idx + 7 >= dates.length}
          sameMonth={isSameMonth(item.date, date)}
          endOfWeek={isEqual(item.date, endOfWeek(item.date))}
          events={events.filter((e) => isSameDay(new Date(e.date), item.date))}
          date={isToday(item.date) ? item.value : format(item.date, `EEE, d ${item.value === 1 ? "MMM" : ""}`)}
        />
      ))}
    </Fragment>
  );
};

type DatesProps = {
  date: Date;
  dates: Array<{ value: number; date: Date }>;
};
