import { FunctionComponent } from "react";

import type { DivideProps } from "types";

const Divide: FunctionComponent<DivideProps> = ({ className, HRclassName }) => {
    return (
        <div
            aria-hidden="true"
            className={className}
        >
            <hr className={HRclassName} />
        </div>
    );
}

export default Divide;
