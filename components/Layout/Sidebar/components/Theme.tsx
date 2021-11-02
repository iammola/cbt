import { FunctionComponent, useEffect, useState } from "react";

import { classNames } from "utils";
import { MoonIcon, SunIcon } from "components/Misc/CustomIcons";

const Theme: FunctionComponent<ThemeProps> = ({ open }) => {
    const [active, setActive] = useState(0);
    const [hovered, setHovered] = useState(active);

    useEffect(() => { setHovered(active); }, [active]);

    return (
        <div className="w-full">
            <span
                className={classNames("w-full inline-block text-gray-600 text-xs font-semibold uppercase tracking-wider pb-4", {
                    "text-center": open === false,
                    "pl-5": open === true,
                })}
            >
                Theme
            </span>
            <div className="flex items-center justify-between w-full h-12 p-1 rounded-full overflow-hidden bg-gray-100 relative z-0">
                <div
                    onClick={() => setActive(0)}
                    onMouseEnter={() => setHovered(0)}
                    onMouseLeave={() => setHovered(active)}
                    className="flex gap-2 items-center justify-center flex-grow text-gray-800 h-full rounded-full cursor-pointer"
                >
                    <SunIcon className="w-5 h-5 flex-shrink-0" />
                    <span
                        className={classNames("text-sm", {
                            "hidden": open === false
                        })}
                    >
                        Light
                    </span>
                </div>
                <div
                    onClick={() => setActive(1)}
                    onMouseEnter={() => setHovered(1)}
                    onMouseLeave={() => setHovered(active)}
                    className="flex gap-2 items-center justify-center flex-grow text-gray-800 h-full rounded-full cursor-pointer"
                >
                    <MoonIcon className="w-5 h-5 flex-shrink-0" />
                    <span
                        className={classNames("text-sm", {
                            "hidden": open === false
                        })}
                    >
                        Dark
                    </span>
                </div>
                <div
                    className={classNames("absolute inset-y-0 z-[-1] w-1/2 h-full py-1 rounded-full transition-all", {
                        "pr-1 left-1": hovered === 0,
                        "pl-1 right-1": hovered === 1
                    })}
                >
                    <span className="inline-block bg-white rounded-full w-full h-full"></span>
                </div>
            </div>
        </div>
    );
}

type ThemeProps = {
    open: boolean;
}

export default Theme;
