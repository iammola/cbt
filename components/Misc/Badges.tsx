import { FunctionComponent } from "react";

const Badges: Badges = ({ children }) => {
    return (
        <span className="inline-block p-3 rounded-full text-white text-xs uppercase">
            {children}
        </span>
    )
}

interface Badges extends FunctionComponent<{ className: string; text: string }> {
}
