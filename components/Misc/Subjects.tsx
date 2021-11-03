import { FunctionComponent } from "react";

const Subjects: Subjects = ({ items }) => {
    return (
        <></>
    );
}

type SubjectItem = {
    name: string;
    subjects: { name: string; }[];
}[];

interface Subjects extends FunctionComponent<{ items: SubjectItem }> {
    Item: FunctionComponent<SubjectItem>;
}

export default Subjects;
