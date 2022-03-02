import { FunctionComponent } from "react";

import { classNames } from "utils";
import type { StudentGridProps } from "types";

const Grid: FunctionComponent<StudentGridProps> = ({ questions }) => {
  return (
    <div className="w-full bg-white rounded-xl shadow-sm py-8 px-5 ring-1 ring-gray-200 sticky top-36">
      <ul className="grid grid-cols-5 gap-4 items-start justify-center w-full">
        {questions.map(({ answered, active }, i) => (
          <li
            key={i}
            className={classNames(
              "flex items-center justify-center rounded-md shadow-sm cursor-pointer text-sm font-semibold tracking-wider ring-1 ring-gray-100 relative group aspect-square",
              {
                "bg-white hover:bg-gray-50 text-gray-700": !answered,
                "bg-gray-500 hover:bg-gray-600 text-gray-200": active,
              }
            )}
          >
            {++i}
            {answered === true && (
              <span
                aria-label={`Question ${i} answered`}
                className={classNames(
                  "absolute top-1.5 right-1.5 rounded-full w-1 h-1",
                  {
                    "bg-gray-200": active,
                    "bg-gray-700": !active,
                  }
                )}
              />
            )}
            <span className="hidden group-hover:inline absolute left-1/2 -top-9 -translate-x-1/2 p-2 rounded-md shadow-md text-xs font-normal text-gray-600 bg-white w-max">
              Go to Question {i}
            </span>
          </li>
        ))}
      </ul>
      <span className="inline-block text-xs font-medium text-gray-500 mt-6">
        {questions.filter(({ answered }) => answered).length} out of{" "}
        {questions.length} answered
      </span>
    </div>
  );
};

export default Grid;
