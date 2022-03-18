import { FunctionComponent } from "react";
import { format, formatDuration, intervalToDuration } from "date-fns";

const TranscriptInfo: FunctionComponent<TranscriptInfoProps> = ({
  birthday,
  gender,
  name,
}) => {
  return (
    <div className="grid w-full grid-flow-col grid-cols-3 grid-rows-2 gap-y-2.5 gap-x-40 px-5">
      <div className="flex items-center justify-start gap-1.5">
        <span className="min-w-max text-xs font-semibold tracking-wide text-gray-700">
          Full Name
        </span>{" "}
        <span className="min-w-max text-sm font-bold uppercase tracking-wide text-gray-800">
          {name}
        </span>
      </div>
      <div className="flex items-center justify-start gap-1.5">
        <span className="min-w-max text-xs font-semibold tracking-wide text-gray-700">
          Age:
        </span>{" "}
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
        <span className="min-w-max text-xs font-semibold tracking-wide text-gray-700">
          Gender:
        </span>{" "}
        <span className="min-w-max text-sm font-medium tracking-wide text-gray-800">
          {gender && (gender === "M" ? "Male" : "Female")}
        </span>
      </div>
      <div className="flex items-center justify-start gap-1.5">
        <span className="min-w-max text-xs font-semibold tracking-wide text-gray-700">
          Printed On:
        </span>{" "}
        <span className="min-w-max text-sm font-medium tracking-wide text-gray-800">
          {format(new Date(), "dd-MM-yyyy")}
        </span>
      </div>
    </div>
  );
};

type TranscriptInfoProps = {
  name?: string;
  birthday?: Date;
  gender?: "M" | "F";
};

export default TranscriptInfo;
