import { FunctionComponent } from "react";

import { classNames } from "utils";
import { MeditatingIllustration, StandingWithPencilIllustration } from "components/Misc/Illustrations";

const Subjects: Subjects = ({ items }) => {
    return (
        <div className="flex xl:flex-col flex-wrap items-start justify-start gap-4 w-full xl:divide-y xl:divide-gray-200">
            {items?.map(item => (
                <Subjects.Item
                    {...item}
                    key={item.name}
                />
            ))}
            {items?.length === 0 && (
                <div className="flex flex-col gap-1 items-center justify-center w-full h-full font-medium text-sm tracking-wider text-gray-600">
                    <StandingWithPencilIllustration className="w-32 h-32" />
                    nothing to see here
                </div>
            )}
            {items === undefined && (
                <div className="flex flex-col gap-1 items-center justify-center w-full h-full font-medium text-sm tracking-wider text-gray-600">
                    <MeditatingIllustration className="w-32 h-32" />
                    Loading Subjects...
                </div>
            )}
        </div>
    );
}

Subjects.Item = function Item({ name, subjects }) {
    const colors = ["bg-blue-400", "bg-red-400", "bg-purple-400", "bg-pink-400", "bg-indigo-400", "bg-green-400"];

    return (
        <div className="flex flex-col gap-3 items-start justify-start flex-grow max-w-full xl:w-full pt-2">
            <span className="font-medium text-sm">
                {name}
            </span>
            <div className="flex flex-col gap-2 w-full">
                {subjects.map(({ name }, i) => (
                    <div
                        key={i}
                        className="flex gap-4 items-center justify-start w-full px-3 py-2 rounded-xl cursor-pointer hover:bg-gray-50"
                    >
                        <span className="text-xs text-gray-500 font-medium">
                            {++i}.
                        </span>
                        <div className={classNames("flex flex-shrink-0 items-center justify-center rounded-full shadow-md w-9 h-9 text-xs text-white font-medium uppercase", colors[Math.floor(Math.random() * colors.length)])}>
                            {name.split(' ', 2).map(word => word[0])}
                        </div>
                        <div className="block truncate font-medium text-xs tracking-wider text-gray-700">
                            {name}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

type SubjectItem = {
    name: string;
    subjects: { name: string; }[];
};

interface Subjects extends FunctionComponent<{ items?: SubjectItem[] }> {
    Item: FunctionComponent<SubjectItem>;
}

export default Subjects;
