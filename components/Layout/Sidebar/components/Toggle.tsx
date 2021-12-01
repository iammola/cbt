import { FunctionComponent } from "react";
import { ChevronRightIcon, XIcon } from "@heroicons/react/solid";

import { classNames } from "utils";

import type { ToggleProps } from "types";

const Toggle: FunctionComponent<ToggleProps> = ({ open, toggleOpen }) => {
    return (
        <div
            onClick={toggleOpen}
            className={classNames("bg-white absolute z-50 top-8 p-1 rounded-full drop-shadow-sm cursor-pointer transition-transform hover:scale-105", {
                "sm:-right-4 right-8": open,
                "-right-12": open === false
            })}
        >
            <ChevronRightIcon
                className={classNames("w-5 h-5 transition-transform fill-gray-600", {
                    "rotate-180 hidden sm:block": open
                })}
            />
            {open === true && (
                <XIcon className="block sm:hidden w-5 h-5 fill-gray-600" />
            )}
        </div>
    );
}

export default Toggle;
