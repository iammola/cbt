import { FunctionComponent } from "react";

const Subjects: FunctionComponent = (props) => {
    return (
        <></>
    );
}

type SubjectItem = {
    name: string;
    subjects: { name: string; }[];
}[];

interface Subjects extends FunctionComponent<{ items: SubjectItem }> { }

export default Subjects;
