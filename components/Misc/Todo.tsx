import { FunctionComponent } from "react";
const Todo: Todo = ({ items }) => {
    return (
        <div className="flex flex-wrap flex-row items-start justify-start content-start gap-x-4 gap-y-3 w-full h-full">
        </div>
    );
}

    return (
        <></>
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
