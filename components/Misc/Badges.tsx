import { FunctionComponent } from "react";

const Badges: Badges = ({ children }) => {
    return (
        <span className="inline-block p-3 rounded-full text-white text-xs uppercase">
            {children}
        </span>
    )
}

Badges.Beta = function Beta() {
    return (
        <Badges
            text="beta"
            className="bg-purple-600"
        />
    );
}

interface Badges extends FunctionComponent<{ className: string; text: string }> {
    Beta: FunctionComponent;
}
