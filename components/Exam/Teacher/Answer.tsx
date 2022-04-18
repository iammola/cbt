import { XIcon } from "@heroicons/react/solid";

import { classNames } from "utils";

import type { TeacherAnswerProps } from "types";

const Answer: React.FC<TeacherAnswerProps> = ({ id, number, answer, isCorrect, deleteAnswer, handleChange }) => {
  return (
    <>
      <input
        id={id}
        type="checkbox"
        className="hidden"
        checked={isCorrect ?? false}
        onChange={(e) => handleChange({ isCorrect: e.target.checked })}
      />
      <label
        htmlFor={id}
        className={classNames(
          "h-3 w-3 shrink-0 cursor-pointer rounded-full text-xs ring-2 ring-gray-400 ring-offset-4 ring-offset-white",
          {
            "bg-gray-400": isCorrect,
            "bg-white": !isCorrect,
          }
        )}
      />
      <input
        required
        type="text"
        value={answer}
        placeholder={`Option ${number}`}
        onChange={({ target: { value } }) => handleChange({ answer: value })}
        className="w-full rounded-t border-b-2 border-transparent py-3 pl-4 pr-10 text-sm font-medium text-gray-700 hover:border-gray-200 focus:border-indigo-300 focus:bg-gray-50 focus:outline-none"
      />
      <span
        onClick={deleteAnswer}
        className="group relative cursor-pointer rounded-full p-2 hover:bg-gray-200"
      >
        <XIcon className="h-5 w-5 fill-gray-700 hover:fill-gray-600" />
        <span className="absolute left-1/2 -top-10 hidden w-max -translate-x-1/2 rounded-md bg-white p-2 text-xs text-gray-600 shadow-md group-hover:inline">
          Delete Option
        </span>
      </span>
    </>
  );
};

export default Answer;
