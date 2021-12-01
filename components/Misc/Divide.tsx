import { FunctionComponent } from "react";

import type { DivideProps } from "types";

const Divide: FunctionComponent<DivideProps> = ({ className }) => {
    return (
        <div
            aria-hidden="true"
            className={className}
        >
            <hr />
        </div>
    );
}

export default Divide;
