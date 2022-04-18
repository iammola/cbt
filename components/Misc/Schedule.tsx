import { classNames } from "utils";

const Schedule: React.FC<ScheduleProps> = ({ title, schedules }) => {
  const colors = [
    "bg-blue-400",
    "bg-red-400",
    "bg-violet-400",
    "bg-pink-400",
    "bg-indigo-400",
    "bg-emerald-400",
    "bg-amber-400",
  ];

  return (
    <div className="flex grow flex-col gap-2">
      <h5 className="font-semibold text-gray-800">{title}</h5>
      <div className="flex h-full flex-col gap-3">
        {schedules.length === 0 && (
          <div className="flex h-full items-center justify-center text-sm text-gray-600">Nothing to see here</div>
        )}
        {schedules.map(({ name, time, questions }, scheduleIdx) => (
          <div
            key={scheduleIdx}
            className="flex cursor-pointer gap-4 rounded-xl p-3 hover:bg-gray-100"
          >
            <div
              className={classNames(
                "flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-medium text-white shadow-xl",
                colors[Math.floor(Math.random() * colors.length)]
              )}
            >
              {name.split(" ", 2).map((word) => word[0])}
            </div>
            <div className="flex flex-col items-start justify-center gap-0.5">
              <span className="block truncate text-sm font-medium tracking-wide text-gray-700">{name}</span>
              <span className="block truncate text-xs text-gray-400">
                {time} mins · {questions} questions
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

interface ScheduleProps {
  title: string;
  schedules: {
    name: string;
    time: number;
    questions: number;
  }[];
}

export default Schedule;
