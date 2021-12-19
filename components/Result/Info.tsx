import { FunctionComponent } from "react";
import { formatDuration, intervalToDuration } from "date-fns";

const Info: FunctionComponent<InfoProps> = ({ average, birthday, gender, name, scores, session, term, ...props }) => {
    return (
        <div className="grid grid-cols-3 grid-rows-5 grid-flow-col gap-y-2.5 gap-x-16 w-full px-5">
            <div className="flex gap-1.5 items-center justify-start">
                <span className="text-xs text-gray-700 font-semibold tracking-wide min-w-max">Full Name:</span>{' '}
                <span className="text-sm font-bold tracking-wide text-gray-800 min-w-max uppercase">
                    {name}
                </span>
            </div>
            <div className="flex gap-1.5 items-center justify-start">
                <span className="text-xs text-gray-700 font-semibold tracking-wide min-w-max">Age:</span>{' '}
                <span className="text-sm font-bold tracking-wide text-gray-800 min-w-max">
                    {birthday !== undefined && formatDuration(intervalToDuration({
                        start: new Date(birthday),
                        end: new Date(),
                    }), { format: ["years"] })} old
                </span>
            </div>
            <div className="flex gap-1.5 items-center justify-start">
                <span className="text-xs text-gray-700 font-semibold tracking-wide min-w-max">Gender:</span>{' '}
                <span className="text-sm font-medium tracking-wide text-gray-800 min-w-max">
                    {gender === "M" ? "Male" : "Female"}
                </span>
            </div>
            <div className="flex gap-1.5 items-center justify-start">
                <span className="text-xs text-gray-700 font-semibold tracking-wide min-w-max">Session:</span>{' '}
                <span className="text-sm font-medium tracking-wide text-gray-800 min-w-max">
                    {session}
                </span>
            </div>
            <div className="flex gap-1.5 items-center justify-start">
                <span className="text-xs text-gray-700 font-semibold tracking-wide min-w-max">Term:</span>{' '}
                <span className="text-sm font-medium tracking-wide text-gray-800 min-w-max">
                    {term}
                </span>
            </div>
            <div className="flex gap-1.5 items-center justify-start">
                <span className="text-xs text-gray-700 font-semibold tracking-wide min-w-max">Final Grade:</span>{' '}
                <span className="text-sm font-bold tracking-wide text-gray-800 min-w-max">
                    {scores.grade}
                </span>
            </div>
            <div className="flex gap-1.5 items-center justify-start">
                <span className="text-xs text-gray-700 font-semibold tracking-wide min-w-max">Class:</span>{' '}
                <span className="text-sm font-medium tracking-wide text-gray-800 min-w-max">
                    {props.class}
                </span>
            </div>
            <div className="flex gap-1.5 items-center justify-start">
                <span className="text-xs text-gray-700 font-semibold tracking-wide min-w-max">Highest Average in Class:</span>{' '}
                <span className="text-sm font-medium tracking-wide text-gray-800 min-w-max">
                    {average.highest.toFixed(1)}
                </span>
            </div>
            <div className="flex gap-1.5 items-center justify-start">
                <span className="text-xs text-gray-700 font-semibold tracking-wide min-w-max">Lowest Average in Class:</span>{' '}
                <span className="text-sm font-medium tracking-wide text-gray-800 min-w-max">
                    {average.lowest.toFixed(1)}
                </span>
            </div>
            <div className="flex gap-1.5 items-center justify-start">
                <span className="text-xs text-gray-700 font-semibold tracking-wide min-w-max">Overall Average in Class:</span>{' '}
                <span className="text-sm font-medium tracking-wide text-gray-800 min-w-max">
                    {average.class.toFixed(1)}
                </span>
            </div>
            <div className="flex gap-1.5 items-center justify-start">
                <span className="text-xs text-gray-700 font-semibold tracking-wide min-w-max">Expected Score:</span>{' '}
                <span className="text-sm font-medium tracking-wide text-gray-800 min-w-max">
                    {scores.expected}
                </span>
            </div>
            <div className="flex gap-1.5 items-center justify-start">
                <span className="text-xs text-gray-700 font-semibold tracking-wide min-w-max">Total Score:</span>{' '}
                <span className="text-sm font-medium tracking-wide text-gray-800 min-w-max">
                    {scores.total.toFixed(1)}
                </span>
            </div>
            <div className="flex gap-1.5 items-center justify-start">
                <span className="text-xs text-gray-700 font-semibold tracking-wide min-w-max">Average:</span>{' '}
                <span className="text-sm font-medium tracking-wide text-gray-800 min-w-max">
                    {average.average.toFixed(1)}
                </span>
            </div>
        </div>
    );
}

type InfoProps = {
    [K in "name" | "class" | "term" | "session"]: string;
} & {
    birthday?: Date;
    gender: "M" | "F";
    average: {
        class: number;
        lowest: number;
        average: number;
        highest: number;
    };
    scores: {
        grade: string;
        total: number;
        expected: number;
    }
};

export default Info;
