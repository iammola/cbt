import { useMemo } from "react";
import { classNames } from "utils";

// prettier-ignore
const twColors = ["bg-amber-400" , "bg-indigo-400", "bg-cyan-400", "bg-pink-400", "bg-lime-400", "bg-violet-400", "bg-rose-400", "bg-teal-400", "bg-slate-400"];

export const Events: React.FC<CP<EventProps>> = ({ children, ...props }) => {
  const colors = useMemo(() => {
    const chosen: string[] = [];
    const mostEvents = props.data.reduce<number>((a, { events }) => Math.max(...[a, events.length]), 0);

    while (chosen.length < mostEvents) {
      const allUsed = chosen.length >= twColors.length;
      const color = twColors[Math.floor(Math.random() * twColors.length)];

      // Prevent the same color in a row when all colors have been used
      if (allUsed && color === chosen[chosen.length - 1]) continue;

      // Prevent duplicate colors when there are still other colors to be used
      if (!allUsed && chosen.includes(color)) continue;

      chosen.push(color);
    }

    return chosen;
  }, [props.data]);

  return (
    <div className={props.className}>
      {props.data.map(({ time, events }) =>
        events.map((event, idx) => (
          <div
            key={event}
            className="flex w-full items-center justify-start gap-x-1.5"
          >
            <span
              aria-hidden="true"
              className={classNames("h-1.5 w-1.5 shrink-0 rounded-full", colors[idx])}
            />
            <span className={props.eventClassName}>{event}</span>
            <span className={props.timeClassName}>{time}</span>
          </div>
        ))
      )}
      {children}
    </div>
  );
};

interface EventProps {
  className: string;
  timeClassName: string;
  eventClassName: string;
  data: {
    time: string;
    events: string[];
  }[];
}
