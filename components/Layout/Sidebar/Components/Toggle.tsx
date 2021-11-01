import { FunctionComponent } from "react";
import { ChevronRightIcon, XIcon } from "@heroicons/react/solid";

import { classNames } from "utils";

const Toggle: FunctionComponent<ToggleProps> = ({ open, toggleOpen }) => {
    return (
        <div
            onClick={toggleOpen}
            className={classNames("bg-white absolute p-1 rounded-full shadow-md text-gray-600 cursor-pointer transition-transform hover:scale-105", {
                "sm:-right-4 right-8": open,
                "-right-12": open === false
            })}
        >
            <ChevronRightIcon
                className={classNames("w-5 h-5 transition-transform", {
                    "rotate-180 hidden sm:block": open
                })}
            />
            {open === true && (
                <XIcon className="block sm:hidden w-5 h-5" />
            )}
        </div>
    );
}

type ToggleProps = {
    open: boolean;
    toggleOpen(): void;
}

export default Toggle;
