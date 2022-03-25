import { FunctionComponent, useMemo } from "react";

import { Events } from "./Events";
import { classNames } from "utils";

export const DateItem: FunctionComponent<DateProps> = ({ date, events, ...is }) => {
  const count = useMemo(() => events.reduce((acc, d) => acc + d.events.length, 0), [events]);
  const first5 = useMemo(
    () =>
      events.reduce((acc, b) => {
        const eventsCount = acc.reduce((acc, d) => acc + d.events.length, 0);

        if (eventsCount < 5)
          acc.push({
            ...b,
            events: b.events.slice(0, 5 - eventsCount),
          });

        return acc;
      }, [] as typeof events),
    [events]
  );

  return (
    <div
      className={classNames(
        "flex w-full flex-col items-end justify-start overflow-hidden border-t border-white/10 pt-1.5 pr-1",
        {
          "border-b": is.lastRow,
          "border-r": !is.endOfWeek,
          "bg-white/5": is.weekend,
          "text-gray-200": !is.weekend,
          "text-gray-400/50": !is.sameMonth,
          "text-gray-400": is.sameMonth && is.weekend,
        }
      )}
    >
      <span
        className={classNames(
          "-mt-1 -mr-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-center",
          { "bg-red-500 text-sm font-semibold text-gray-800": is.today }
        )}
      >
        {date}
      </span>
      <Events
        data={first5}
        className="w-full grow pl-2 empty:hidden"
      >
        {count > 5 && <span className="w-full pl-3 text-xs font-semibold text-gray-400">{count - 5} more...</span>}
      </Events>
    </div>
  );
};

interface DateProps extends Record<"today" | "lastRow" | "endOfWeek" | "weekend" | "sameMonth", boolean> {
  date: number;
  events: {
    date: Date;
    time: string;
    events: string[];
  }[];
}
