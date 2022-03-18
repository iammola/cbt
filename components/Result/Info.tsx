import { FunctionComponent } from "react";
import { formatDuration, intervalToDuration } from "date-fns";

const Info: FunctionComponent<DeepPartial<InfoProps>> = ({
  average,
  birthday,
  gender,
  name,
  scores,
  session,
  term,
  ...props
}) => {
  return (
    <div className="grid w-full grid-flow-col grid-cols-3 grid-rows-5 gap-y-2.5 gap-x-40 px-5">
      <div className="flex items-center justify-start gap-1.5">
        <span className="min-w-max text-xs font-semibold tracking-wide text-gray-700">Full Name:</span>{" "}
        <span className="min-w-max text-sm font-bold uppercase tracking-wide text-gray-800">{name}</span>
      </div>
      <div className="flex items-center justify-start gap-1.5">
        <span className="min-w-max text-xs font-semibold tracking-wide text-gray-700">Age:</span>{" "}
        <span className="min-w-max text-sm font-bold tracking-wide text-gray-800">
          {birthday !== undefined &&
            formatDuration(
              intervalToDuration({
                start: new Date(birthday),
                end: new Date(),
              }),
              { format: ["years"] }
            )}{" "}
          old
        </span>
      </div>
      <div className="flex items-center justify-start gap-1.5">
        <span className="min-w-max text-xs font-semibold tracking-wide text-gray-700">Gender:</span>{" "}
        <span className="min-w-max text-sm font-medium tracking-wide text-gray-800">
          {gender && (gender === "M" ? "Male" : "Female")}
        </span>
      </div>
      <div className="flex items-center justify-start gap-1.5">
        <span className="min-w-max text-xs font-semibold tracking-wide text-gray-700">Session:</span>{" "}
        <span className="min-w-max text-sm font-medium tracking-wide text-gray-800">{session}</span>
      </div>
      <div className="flex items-center justify-start gap-1.5">
        <span className="min-w-max text-xs font-semibold tracking-wide text-gray-700">Term:</span>{" "}
        <span className="min-w-max text-sm font-medium tracking-wide text-gray-800">{term}</span>
      </div>
      <div className="flex items-center justify-start gap-1.5">
        <span className="min-w-max text-xs font-semibold tracking-wide text-gray-700">Final Grade:</span>{" "}
        <span className="min-w-max text-sm font-bold tracking-wide text-gray-800">{scores?.grade}</span>
      </div>
      <div className="flex items-center justify-start gap-1.5">
        <span className="min-w-max text-xs font-semibold tracking-wide text-gray-700">Class:</span>{" "}
        <span className="min-w-max text-sm font-medium tracking-wide text-gray-800">{props.class}</span>
      </div>
      <div className="flex items-center justify-start gap-1.5">
        <span className="min-w-max text-xs font-semibold tracking-wide text-gray-700">Highest Class Average:</span>{" "}
        <span className="min-w-max text-sm font-medium tracking-wide text-gray-800">
          {average?.highest?.toFixed(1)}
        </span>
      </div>
      <div className="flex items-center justify-start gap-1.5">
        <span className="min-w-max text-xs font-semibold tracking-wide text-gray-700">Lowest Class Average:</span>{" "}
        <span className="min-w-max text-sm font-medium tracking-wide text-gray-800">{average?.lowest?.toFixed(1)}</span>
      </div>
      <div className="flex items-center justify-start gap-1.5">
        <span className="min-w-max text-xs font-semibold tracking-wide text-gray-700">Class Average:</span>{" "}
        <span className="min-w-max text-sm font-medium tracking-wide text-gray-800">{average?.class?.toFixed(1)}</span>
      </div>
      <div className="flex items-center justify-start gap-1.5">
        <span className="min-w-max text-xs font-semibold tracking-wide text-gray-700">Expected Score:</span>{" "}
        <span className="min-w-max text-sm font-medium tracking-wide text-gray-800">{scores?.expected}</span>
      </div>
      <div className="flex items-center justify-start gap-1.5">
        <span className="min-w-max text-xs font-semibold tracking-wide text-gray-700">Total Score:</span>{" "}
        <span className="min-w-max text-sm font-medium tracking-wide text-gray-800">{scores?.total?.toFixed(1)}</span>
      </div>
      <div className="flex items-center justify-start gap-1.5">
        <span className="min-w-max text-xs font-semibold tracking-wide text-gray-700">Average:</span>{" "}
        <span className="min-w-max text-sm font-medium tracking-wide text-gray-800">
          {average?.average?.toFixed(1)}
        </span>
      </div>
    </div>
  );
};

type InfoProps = {
  [K in "name" | "class" | "term" | "session"]: string;
} & {
  birthday?: Date;
  gender: "M" | "F";
  average: {
    class: number;
    lowest: number;
    average: number;
    highest: number;
  };
  scores: {
    grade: string;
    total: number;
    expected: number;
  };
};

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export default Info;
