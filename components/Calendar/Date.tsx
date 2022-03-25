import { FunctionComponent, useMemo } from "react";

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
  const colors = [
    "bg-amber-400",
    "bg-indigo-400",
    "bg-cyan-400",
    "bg-pink-400",
    "bg-lime-400",
    "bg-violet-400",
    "bg-rose-400",
    "bg-teal-400",
    "bg-slate-400",
  ];

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
      <div className="flex w-full grow flex-col items-start justify-start pl-2 empty:hidden">
        {first5.map(({ time, events }) =>
          events.map((event, idx) => (
            <div
              key={event}
              className="flex w-full items-center justify-start gap-1.5"
            >
              <span
                aria-hidden="true"
                className={classNames("h-1.5 w-1.5 shrink-0 rounded-full", colors[idx % colors.length])}
              />
              <span className="block grow truncate text-xs tracking-wide text-gray-50">{event}</span>
              <span className="shrink-0 text-[0.625rem] tracking-wider text-gray-200">{time}</span>
            </div>
          ))
        )}
        {count > 5 && <span className="w-full pl-3 text-xs font-semibold text-gray-400">{count - 5} more...</span>}
      </div>
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
