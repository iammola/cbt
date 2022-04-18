import { format } from "date-fns";
const TranscriptInfo: React.FC<TranscriptInfoProps> = ({ birthday, gender, name, ...props }) => {
  const items = [
    ["Full Name", name],
    ["Class", props.class],
    ["Birthday", birthday !== undefined && format(new Date(birthday), "EEEE, do MMMM yyyy")],
    ["Gender", gender ? (gender === "M" ? "Male" : "Female") : ""],
    ["Date", format(new Date(), "EEEE, do MMMM yyyy")],
  ] as const;

  return (
    <div className="flex w-full flex-row flex-wrap items-center justify-start gap-x-12 gap-y-4 px-5">
      {items.map(([key, val]) => (
        <div
          key={key}
          className="group flex items-center justify-start gap-1.5"
        >
          <span className="min-w-max text-xs font-semibold tracking-wide text-gray-700">{key}:</span>{" "}
          <span className="min-w-max text-sm font-bold uppercase tracking-wide text-gray-800 group-last:font-normal group-last:normal-case">
            {val}
          </span>
        </div>
      ))}
    </div>
  );
};

type TranscriptInfoProps = {
  name?: string;
  class?: string;
  birthday?: Date;
  gender?: "M" | "F";
};

export default TranscriptInfo;
