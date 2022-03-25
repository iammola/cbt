import { FunctionComponent } from "react";

import { classNames } from "utils";

export const Events: FunctionComponent<EventProps> = ({ children, className, data }) => {
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
    <div className={className}>
      {data.map(({ time, events }) =>
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
      {children}
    </div>
  );
};

interface EventProps {
  className: string;
  data: {
    time: string;
    events: string[];
  }[];
}
