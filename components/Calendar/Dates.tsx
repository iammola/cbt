import useSWR from "swr";
import { FunctionComponent, useMemo } from "react";
import { isEqual, isToday, isSameMonth, endOfWeek, isWeekend, isSameDay } from "date-fns";

import { DateItem } from "./Date";
import { classNames } from "utils";

import type { RouteData } from "types";
import type { EventsRangeGETData } from "types/api";

export const Dates: FunctionComponent<DatesProps> = ({ date, dates }) => {
  const { data: { data: events } = { data: [] } } = useSWR<RouteData<EventsRangeGETData>>(
    dates.length > 1 && `/api/events/range/?from=${dates[0]?.date.getTime()}&to=${dates.at(-1)?.date.getTime()}`
  );

  return (
    <div
      className="grid w-full grow grid-cols-7"
      style={{ gridTemplateRows: "repeat(5, 20%)" }}
    >
      {dates.map((item, idx) => (
        <DateItem
          key={idx}
          date={item.value}
          today={isToday(item.date)}
          weekend={isWeekend(item.date)}
          lastRow={idx + 7 >= dates.length}
          sameMonth={isSameMonth(item.date, date)}
          endOfWeek={isEqual(item.date, endOfWeek(item.date))}
          events={events.filter((e) => isSameDay(new Date(e.date), item.date))}
        />
      ))}
    </div>
  );
};

type DatesProps = {
  date: Date;
  dates: Array<{ value: number; date: Date }>;
};
