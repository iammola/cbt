import { format } from "date-fns";
import { FunctionComponent } from "react";

const Info: FunctionComponent<DeepPartial<InfoProps>> = (props) => {
  const items = [
    ["Full Name", props.name],
    ["Birthday", props.birthday !== undefined && format(new Date(props.birthday), "EEEE, do MMMM yyyy")],
    ["Gender", props.gender ? (props.gender === "M" ? "Male" : "Female") : ""],
    ["Session", props.session],
    ["Term", props.term],
    ["Final Grade", props.scores?.grade],
    ["Class", props.class],
    ["Highest Class Average", props.average?.highest?.toFixed(1)],
    ["Lowest Class Average", props.average?.lowest?.toFixed(1)],
    ["Class Average", props.average?.class?.toFixed(1)],
    ["Expected Score", props.scores?.expected],
    ["Total Score", props.scores?.total?.toFixed(1)],
    ["Personal Average", props.average?.average?.toFixed(1)],
  ] as const;

  return (
    <div className="grid w-full grid-flow-col grid-cols-[repeat(3,_minmax(max-content,_1fr))] grid-rows-5 gap-y-3 gap-x-8 px-5">
      {items.map(([key, val]) => (
        <div
          key={key}
          className="group flex min-w-0 items-center justify-start gap-1.5"
        >
          <span className="min-w-max text-xs font-semibold tracking-wide text-gray-700">{key}:</span>{" "}
          <span className="min-w-max text-sm font-medium tracking-wide text-gray-800 group-first:font-bold group-first:uppercase">
            {val}
          </span>
        </div>
      ))}
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
