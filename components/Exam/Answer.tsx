import { FunctionComponent } from "react";
import { XIcon } from "@heroicons/react/solid";

import { AnswerRecord } from "db/models/Answer";
import { OuterCircleIcon, CircleOutlineIcon } from "components/CustomIcons";

const Answer: FunctionComponent<AnswerProps> = ({ id, letter, answer, isCorrect, deleteOption, handleChange }) => {
    return (
        <>
            <label
                htmlFor={id}
                className="flex items-center justify-start gap-[inherit]"
            >
                {isCorrect === true ? (
                    <OuterCircleIcon className="flex-shrink-0 text-blue-500" />
                ) : (
                    <CircleOutlineIcon className="flex-shrink-0 text-gray-500" />
                )}
                <span>
                    {letter}.
                </span>
            </label>
            <input
                required
                type="text"
                value={answer}
                onChange={({ target: { value } }) => handleChange({ answer: value })}
                className="w-full border rounded-lg transition-shadow focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 focus:ring-offset-white focus:outline-none py-3 pl-5"
            />
            <span
                onClick={deleteOption}
                className="group relative p-2 rounded-full cursor-pointer text-gray-700 hover:text-gray-600 hover:bg-gray-200"
            >
                <XIcon className="w-5 h-5" />
                <span className="hidden group-hover:inline absolute left-1/2 -top-10 -translate-x-1/2 p-2 rounded-md shadow-md text-xs text-gray-600 bg-white w-max">
                    Delete Option
                </span>
            </span>
            <input
                id={id}
                type="checkbox"
                className="hidden"
                checked={isCorrect ?? false}
                onChange={({ target: { checked } }) => handleChange({ isCorrect: checked })}
            />
        </>
    );
}

type AnswerProps = AnswerRecord & {
    id: string;
    letter: string;
    deleteOption(): void;
    handleChange(answer: Partial<AnswerRecord>): void;
}

export default Answer;
