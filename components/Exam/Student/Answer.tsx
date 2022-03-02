import type { FunctionComponent } from "react";

import { classNames } from "utils";
import type { StudentAnswerProps } from "types";

const Answer: FunctionComponent<StudentAnswerProps> = ({
  _id,
  answer,
  selected,
  handleSelect,
}) => {
  return (
    <>
      <input
        id={_id.toString()}
        type="checkbox"
        className="hidden"
        checked={selected ?? false}
        onChange={({ target: { checked } }) => checked && handleSelect(_id)}
      />
      <label
        htmlFor={_id.toString()}
        className={classNames(
          "h-3 w-3 shrink-0 cursor-pointer rounded-full text-xs ring-2 ring-gray-400 ring-offset-4 ring-offset-white",
          {
            "bg-gray-400": selected,
            "bg-white": !selected,
          }
        )}
      />
      <label htmlFor={_id.toString()} className="w-full cursor-pointer">
        <p className="w-full rounded-t py-3 pl-4 pr-10 text-sm font-medium text-gray-700">
          {answer}
        </p>
      </label>
    </>
  );
};

export default Answer;
