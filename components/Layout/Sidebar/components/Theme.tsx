import { FunctionComponent } from "react";

import { MoonIcon, SunIcon } from "components/Misc/CustomIcons";

const Theme: FunctionComponent<ThemeProps> = ({ open }) => {
    return (
        <div className="flex items-center justify-between w-full h-12 p-1 rounded-full overflow-hidden bg-gray-100">
            <div className="flex gap-2 items-center justify-center flex-grow text-gray-800 h-full rounded-full cursor-pointer bg-white">
                <SunIcon className="w-5 h-5" />
                <span className="text-sm">
                    Light
                </span>
            </div>
            <div className="flex gap-2 items-center justify-center flex-grow text-gray-800 h-full rounded-full cursor-pointer">
                <MoonIcon className="w-5 h-5" />
                <span className="text-sm">
                    Dark
                </span>
            </div>
        </div>
    );
}

type ThemeProps = {
    open: boolean;
}

export default Theme;
