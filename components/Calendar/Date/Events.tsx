import { classNames } from "utils";

export const Events: React.FC<CP<EventProps>> = ({ children, ...props }) => {
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
    <div className={props.className}>
      {props.data.map(({ time, events }) =>
        events.map((event, idx) => (
          <div
            key={event}
            className="flex w-full items-center justify-start gap-x-1.5"
          >
            <span
              aria-hidden="true"
              className={classNames("h-1.5 w-1.5 shrink-0 rounded-full", colors[idx % colors.length])}
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
