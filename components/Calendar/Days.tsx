import { FunctionComponent } from "react";

import { classNames } from "utils";

export const Days: FunctionComponent = () => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="grid w-full grid-cols-7 py-2">
      {days.map((day, i) => (
        <span
          key={day}
          className={classNames("w-full px-3 text-right", {
            "font-medium text-gray-400": [0, 6].includes(i),
            "text-gray-300": ![0, 6].includes(i),
          })}
        >
          {day}
        </span>
      ))}
    </div>
  );
};
