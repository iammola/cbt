import { FunctionComponent } from "react";
const Todo: Todo = ({ items }) => {

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
