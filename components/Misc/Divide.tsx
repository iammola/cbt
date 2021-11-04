import { FunctionComponent } from "react";

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

type DivideProps = {
    className: string;
}

export default Divide;
