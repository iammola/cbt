import { FunctionComponent } from "react";

const Badges: Badges = ({ className, text }) => {
    return (
        <span className="inline-block p-3 rounded-full text-white text-xs uppercase">
            {children}
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
            className="bg-red-600"
            text="Soon"
        />
    );
}

interface Badges extends FunctionComponent<{ className: string; text: string }> {
    Beta: FunctionComponent;
    Soon: FunctionComponent;
}

export default Badges;
