import { FunctionComponent } from "react";
import { compareAsc, formatDistance, isFuture } from "date-fns";

import { classNames } from "utils";

const Todo: Todo = ({ items }) => {
    return (
        <div className="flex flex-wrap flex-row items-start justify-start content-start gap-x-4 gap-y-3 w-full h-full">
            {items.filter(a => isFuture(new Date(a.date))).sort((a, b) => compareAsc(new Date(a.date), new Date(b.date))).map((item, i) => (
                <Todo.Item
                    key={i}
                    {...item}
                />
            ))}
        </div>
    );
}

Todo.Item = function Item({ name, ...props }) {
    const date = formatDistance(new Date(props.date), new Date, { addSuffix: true });
    const colors = ["bg-blue-400", "bg-red-400", "bg-purple-400", "bg-pink-400", "bg-indigo-400", "bg-green-400"];

    return (
        <div className="flex gap-4 justify-start w-[31%] p-3 rounded-xl cursor-pointer hover:bg-gray-50">
            <div className={classNames("flex flex-shrink-0 items-center justify-center rounded-full shadow-md w-10 h-10 text-sm text-white font-medium", colors[Math.floor(Math.random() * colors.length)])}>
                {name.split(' ', 2).map(word => word[0])}
            </div>
            <div className="flex flex-col gap-0.5 items-start justify-center">
                <span className="block truncate font-medium text-sm tracking-wide text-gray-700">
                    {name}
                </span>
                <span className="block truncate text-sm text-gray-500">
                    {props.class}
                </span>
                <span className="block truncate text-xs text-gray-400">
                    {date[0].toUpperCase()}{date.slice(1)}
                </span>
            </div>
        </div>
    );
}

type TodoItem = {
    name: string;
    class: string;
    date: Date;
}

interface Todo extends FunctionComponent<{ items: TodoItem[]; }> {
    Item: FunctionComponent<TodoItem>;
}

export default Todo;
