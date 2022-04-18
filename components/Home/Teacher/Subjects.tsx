import { classNames } from "utils";
import { MeditatingIllustration, StandingWithPencilIllustration } from "components/Misc/Illustrations";

const Subjects: Subjects = ({ items }) => {
  return (
    <div className="flex w-full flex-wrap items-start justify-start gap-4 xl:flex-col xl:divide-y xl:divide-gray-200">
      {items?.map((item) => (
        <Subjects.Item
          {...item}
          key={item.name}
        />
      ))}
      {items?.length === 0 && (
        <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-sm font-medium tracking-wider text-gray-600">
          <StandingWithPencilIllustration className="h-32 w-32" />
          nothing to see here
        </div>
      )}
      {items === undefined && (
        <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-sm font-medium tracking-wider text-gray-600">
          <MeditatingIllustration className="h-32 w-32" />
          Loading Subjects...
        </div>
      )}
    </div>
  );
};

Subjects.Item = function Item({ name, subjects }) {
  const colors = ["bg-blue-400", "bg-red-400", "bg-violet-400", "bg-pink-400", "bg-indigo-400", "bg-emerald-400"];

  return (
    <div className="flex max-w-full grow flex-col items-start justify-start gap-3 pt-2 xl:w-full">
      <span className="text-sm font-medium">{name}</span>
      <div className="flex w-full flex-col gap-2">
        {subjects.map(({ name }, i) => (
          <div
            key={i}
            className="flex w-full cursor-pointer items-center justify-start gap-4 rounded-xl px-3 py-2 hover:bg-gray-50"
          >
            <span className="text-xs font-medium text-gray-500">{++i}.</span>
            <div
              className={classNames(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-medium uppercase text-white shadow-md",
                colors[Math.floor(Math.random() * colors.length)]
              )}
            >
              {name.split(" ", 2).map((word) => word[0])}
            </div>
            <div className="block truncate text-xs font-medium tracking-wider text-gray-700">{name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

type SubjectItem = {
  name: string;
  subjects: { name: string }[];
};

interface Subjects extends React.FC<{ items?: SubjectItem[] }> {
  Item: React.FC<SubjectItem>;
}

export default Subjects;
