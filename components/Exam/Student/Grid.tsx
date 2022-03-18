import { FunctionComponent } from "react";

import { classNames } from "utils";
import type { StudentGridProps } from "types";

const Grid: FunctionComponent<StudentGridProps> = ({ questions }) => {
  return (
    <div className="sticky top-36 w-full rounded-xl bg-white py-8 px-5 shadow-sm ring-1 ring-gray-200">
      <ul className="grid w-full grid-cols-5 items-start justify-center gap-4">
        {questions.map(({ answered, active }, i) => (
          <li
            key={i}
            className={classNames(
              "group relative flex aspect-square cursor-pointer items-center justify-center rounded-md text-sm font-semibold tracking-wider shadow-sm ring-1 ring-gray-100",
              {
                "bg-white text-gray-700 hover:bg-gray-50": !answered,
                "bg-gray-500 text-gray-200 hover:bg-gray-600": active,
              }
            )}
          >
            {++i}
            {answered && (
              <span
                aria-label={`Question ${i} answered`}
                className={classNames("absolute top-1.5 right-1.5 h-1 w-1 rounded-full", {
                  "bg-gray-200": active,
                  "bg-gray-700": !active,
                })}
              />
            )}
            <span className="absolute left-1/2 -top-9 hidden w-max -translate-x-1/2 rounded-md bg-white p-2 text-xs font-normal text-gray-600 shadow-md group-hover:inline">
              Go to Question {i}
            </span>
          </li>
        ))}
      </ul>
      <span className="mt-6 inline-block text-xs font-medium text-gray-500">
        {questions.filter(({ answered }) => answered).length} out of {questions.length} answered
      </span>
    </div>
  );
};

export default Grid;
