import { FunctionComponent } from "react";

import { classNames } from "utils";
import { MoonIcon, SunIcon } from "components/Misc/CustomIcons";

const Theme: FunctionComponent<ThemeProps> = ({ open }) => {
    return (
        <div className="flex items-center justify-between w-full h-12 p-1 rounded-full overflow-hidden bg-gray-100 relative z-0">
            <div className="flex gap-2 items-center justify-center flex-grow text-gray-800 h-full rounded-full cursor-pointer">
                <SunIcon className="w-5 h-5 flex-shrink-0" />
                <span
                    className={classNames("text-sm", {
                        "hidden": open === false
                    })}
                >
                    Light
                </span>
            </div>
            <div className="flex gap-2 items-center justify-center flex-grow text-gray-800 h-full rounded-full cursor-pointer">
                <MoonIcon className="w-5 h-5 flex-shrink-0" />
                <span
                    className={classNames("text-sm", {
                        "hidden": open === false
                    })}
                >
                    Dark
                </span>
            </div>
            <div className="absolute inset-y-0 z-[-1] w-1/2 h-full pr-1 py-1 rounded-full">
                <span className="inline-block bg-white rounded-full w-full h-full"></span>
            </div>
        </div>
    );
}

type ThemeProps = {
    open: boolean;
}

export default Theme;
