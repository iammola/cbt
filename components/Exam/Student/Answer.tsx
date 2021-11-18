import type { FunctionComponent } from "react";

import { classNames } from "utils";
import type { StudentAnswerProps } from "types";

const Answer: FunctionComponent<StudentAnswerProps> = ({ _id, answer, selected, handleSelect }) => {
    return (
        <>
            <input
                id={_id.toString()}
                type="checkbox"
                className="hidden"
                checked={selected ?? false}
                onChange={({ target: { checked } }) => checked === true && handleSelect(_id)}
            />
            <label
                htmlFor={_id.toString()}
                className={classNames("w-3 h-3 rounded-full text-xs flex-shrink-0 ring-2 ring-offset-4 ring-gray-400 ring-offset-white cursor-pointer", {
                    "bg-gray-400": selected,
                    "bg-white": !selected
                })}
            />
            <label
                htmlFor={_id.toString()}
                className="w-full cursor-pointer"
            >
                <p className="w-full rounded-t py-3 pl-4 pr-10 text-gray-700 font-medium text-sm">
                    {answer}
                </p>
            </label>
        </>
    );
}

export default Answer;
