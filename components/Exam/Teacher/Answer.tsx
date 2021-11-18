import { FunctionComponent } from "react";
import { XIcon } from "@heroicons/react/outline";

import { classNames } from "utils";

import type { TeacherAnswerProps } from "types";

const Answer: FunctionComponent<TeacherAnswerProps> = ({ id, number, answer, isCorrect, deleteAnswer, handleChange }) => {
    return (
        <>
            <input
                id={id}
                type="checkbox"
                className="hidden"
                checked={isCorrect ?? false}
                onChange={({ target: { checked } }) => handleChange({ isCorrect: checked === true ? true : undefined })}
            />
            <label
                htmlFor={id}
                className={classNames("w-3 h-3 rounded-full text-xs shrink-0 ring-2 ring-offset-4 ring-gray-400 ring-offset-white cursor-pointer", {
                    "bg-gray-400": isCorrect,
                    "bg-white": !isCorrect
                })}
            />
            <input
                required
                type="text"
                value={answer}
                placeholder={`Option ${number}`}
                onChange={({ target: { value } }) => handleChange({ answer: value })}
                className="w-full rounded-t py-3 pl-4 pr-10 text-gray-700 font-medium text-sm border-b-2 border-transparent focus:bg-gray-50 hover:border-gray-200 focus:border-indigo-300 focus:outline-none"
            />
            <span
                onClick={deleteAnswer}
                className="group relative p-2 rounded-full cursor-pointer text-gray-700 hover:text-gray-600 hover:bg-gray-200"
            >
                <XIcon className="w-5 h-5" />
                <span className="hidden group-hover:inline absolute left-1/2 -top-10 -translate-x-1/2 p-2 rounded-md shadow-md text-xs text-gray-600 bg-white w-max">
                    Delete Option
                </span>
            </span>
        </>
    );
}

export default Answer;
