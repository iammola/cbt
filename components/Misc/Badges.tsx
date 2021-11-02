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
            className="bg-purple-600"
        />
    );
}

Badges.Soon = function Soon() {
    return (
        <Badges
            text="Soon"
            className="bg-pink-500"
        />
    );
}

Badges.New = function New() {
    return (
        <Badges
            text="New"
            className="bg-green-500"
        />
    );
}

interface Badges extends FunctionComponent<{ className: string; text: string }> {
    Beta: FunctionComponent;
    Soon: FunctionComponent;
    New: FunctionComponent;
}

export default Badges;
