import { FunctionComponent } from "react";

import { classNames } from "utils";

const Badges: Badges = ({ className, text }) => {
    return (
        <span className={classNames("inline-block py-1 px-2 rounded-full text-white text-[0.6rem] font-medium tracking-wider", className)}>
            {text}
        </span>
    )
}

Badges.Beta = function Beta() {
    return (
        <Badges
            text="Beta"
            className="text-indigo-800 bg-indigo-50"
        />
    );
}

Badges.Soon = function Soon() {
    return (
        <Badges
            text="Soon"
            className="text-pink-800 bg-pink-50"
        />
    );
}

Badges.New = function New() {
    return (
        <Badges
            text="New"
            className="text-blue-800 bg-blue-50"
        />
    );
}

interface Badges extends FunctionComponent<{ className: string; text: string }> {
    Beta: FunctionComponent;
    Soon: FunctionComponent;
    New: FunctionComponent;
}

export default Badges;
