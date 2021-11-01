import { FunctionComponent } from "react";

const Toggle: FunctionComponent<ToggleProps> = ({ open, toggleOpen }) => {
    return (
        <></>
    );
}

type ToggleProps = {
    open: boolean;
    toggleOpen(): void;
}

export default Toggle;
