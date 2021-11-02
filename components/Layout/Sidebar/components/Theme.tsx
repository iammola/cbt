import { FunctionComponent } from "react";

const Theme: FunctionComponent = () => {
    return (
        <div className="flex items-center justify-between w-full h-12 p-1 rounded-full overflow-hidden bg-gray-100">
            <div className="flex gap-2 items-center justify-center flex-grow h-full rounded-full cursor-pointer bg-white">
                <span className="text-sm">
                    Light
                </span>
            </div>
            <div className="flex gap-2 items-center justify-center flex-grow h-full rounded-full cursor-pointer">
                <span className="text-sm">
                    Dark
                </span>
            </div>
        </div>
    );
}

export default Theme;
