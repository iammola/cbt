import { FunctionComponent } from "react";
import {
  SortAscendingIcon,
  SortDescendingIcon,
  TrashIcon,
} from "@heroicons/react/outline";

import { Answer } from ".";

import type { TeacherQuestionProps } from "types";

const Question: FunctionComponent<TeacherQuestionProps> = ({
  record,
  number,
  onChange,
  deleteQuestion,
  insertQuestionBelow,
  insertQuestionAbove,
}) => {
  return (
    <div className="w-full rounded-xl bg-white pt-8 pb-3 pr-7 pl-4 shadow-sm">
      <input
        required
        type="text"
        value={record.question}
        placeholder={`Question ${number} `}
        onChange={({ target: { value } }) => onChange({ question: value })}
        className="w-full rounded-t border-b-2 border-transparent py-3 pl-4 pr-10 text-sm font-medium text-gray-700 focus:border-b-2 focus:border-indigo-300 focus:bg-gray-50 focus:outline-none"
      />
      <ul className="my-5 flex w-full flex-col items-start justify-start gap-3 pl-4">
        {record.answers.map((answer, answerIdx) => (
          <li
            key={answerIdx}
            className="flex w-full items-center justify-start gap-4"
          >
            <Answer
              {...answer}
              number={answerIdx + 1}
              id={`${number}${answerIdx}`}
              deleteAnswer={() =>
                onChange({
                  answers: record.answers.filter((_, i) => i !== answerIdx),
                })
              }
              handleChange={(answer) =>
                onChange({
                  answers: record.answers.map((value, idx) =>
                    idx === answerIdx
                      ? { ...value, ...answer }
                      : {
                          ...value,
                          isCorrect:
                            answer.isCorrect === true &&
                            record.type === "Multiple choice"
                              ? undefined
                              : value.isCorrect,
                        }
                  ),
                })
              }
            />
          </li>
        ))}
        <button
          type="button"
          onClick={() =>
            onChange({ answers: [...record.answers, { answer: "" }] })
          }
          className="cursor-pointer rounded-md bg-gray-500 py-2 px-4 text-sm text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-white"
        >
          Add Option
        </button>
      </ul>
      <div className="flex w-full items-center justify-end gap-3 border-t py-1 pl-4">
        <span
          onClick={insertQuestionAbove}
          className="group relative cursor-pointer rounded-full p-2.5 hover:bg-gray-100"
        >
          <SortAscendingIcon className="h-5 w-5 stroke-gray-700 hover:stroke-gray-600" />
          <span className="absolute left-1/2 -top-10 hidden w-max -translate-x-1/2 rounded-md bg-white p-2 text-xs text-gray-600 shadow-md group-hover:inline">
            Insert Question Above
          </span>
        </span>
        <span
          onClick={insertQuestionBelow}
          className="group relative cursor-pointer rounded-full p-2.5 hover:bg-gray-100"
        >
          <SortDescendingIcon className="h-5 w-5 stroke-gray-700 hover:stroke-gray-600" />
          <span className="absolute left-1/2 -top-10 hidden w-max -translate-x-1/2 rounded-md bg-white p-2 text-xs text-gray-600 shadow-md group-hover:inline">
            Insert Question Below
          </span>
        </span>
        <span
          onClick={deleteQuestion}
          className="group relative cursor-pointer rounded-full p-2.5 hover:bg-gray-100"
        >
          <TrashIcon className="h-5 w-5 stroke-gray-700 hover:stroke-gray-600" />
          <span className="absolute left-1/2 -top-10 hidden w-max -translate-x-1/2 rounded-md bg-white p-2 text-xs text-gray-600 shadow-md group-hover:inline">
            Delete Question
          </span>
        </span>
      </div>
    </div>
  );
};

export default Question;
