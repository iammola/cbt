import { FunctionComponent } from "react";
import { ChevronRightIcon, XIcon } from "@heroicons/react/solid";

import { classNames } from "utils";

import type { ToggleProps } from "types";

const Toggle: FunctionComponent<ToggleProps> = ({ open, toggleOpen }) => {
  return (
    <div
      onClick={toggleOpen}
      className={classNames(
        "absolute top-8 z-50 cursor-pointer rounded-full bg-white p-1 drop-shadow-sm transition-transform hover:scale-105",
        {
          "right-8 sm:-right-4": open,
          "-right-12": !open,
        }
      )}
    >
      <ChevronRightIcon
        className={classNames("h-5 w-5 fill-gray-600 transition-transform", {
          "hidden rotate-180 sm:block": open,
        })}
      />
      {open && <XIcon className="block h-5 w-5 fill-gray-600 sm:hidden" />}
    </div>
  );
};

export default Toggle;
