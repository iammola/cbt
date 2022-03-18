import { FunctionComponent } from "react";
import { compareAsc, formatDistance, isFuture } from "date-fns";

import { classNames } from "utils";
import { CalendarIllustration, StandingChatIllustration } from "components/Misc/Illustrations";

const Todo: Todo = ({ items }) => {
  const filtered = items
    ?.filter((a) => isFuture(new Date(a.date)))
    .sort((a, b) => compareAsc(new Date(a.date), new Date(b.date)));

  return (
    <div className="flex h-full w-full grow flex-row flex-wrap content-start items-start justify-start gap-x-4 gap-y-3">
      {filtered?.map((item, i) => (
        <Todo.Item
          key={i}
          {...item}
        />
      ))}
      {filtered?.length === 0 && (
        <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-sm text-gray-600">
          <CalendarIllustration className="h-28 w-28" />
          nothing to see here
        </div>
      )}
      {filtered === undefined && (
        <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-sm font-medium tracking-wider text-gray-600">
          <StandingChatIllustration className="h-32 w-32" />
          Loading Exams...
        </div>
      )}
    </div>
  );
};

Todo.Item = function Item({ name, ...props }) {
  const date = formatDistance(new Date(props.date), new Date(), {
    addSuffix: true,
  });
  const colors = ["bg-blue-400", "bg-red-400", "bg-violet-400", "bg-pink-400", "bg-indigo-400", "bg-emerald-400"];

  return (
    <div className="flex w-[31%] cursor-pointer items-center justify-start gap-4 rounded-xl p-3 hover:bg-gray-50">
      <div
        className={classNames(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-medium uppercase text-white shadow-md",
          colors[Math.floor(Math.random() * colors.length)]
        )}
      >
        {name.split(" ", 2).map((word) => word[0])}
      </div>
      <div className="flex flex-col items-start justify-center gap-0.5">
        <span className="block truncate text-sm font-medium tracking-wide text-gray-700">{name}</span>
        <span className="block truncate text-sm text-gray-600">{props.class}</span>
        <span className="block truncate text-xs text-gray-500">Deadline {date}</span>
      </div>
    </div>
  );
};

type TodoItem = {
  name: string;
  class: string;
  date: Date;
};

interface Todo extends FunctionComponent<{ items?: TodoItem[] }> {
  Item: FunctionComponent<TodoItem>;
}

export default Todo;
