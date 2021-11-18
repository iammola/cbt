import { FunctionComponent } from "react";

import { classNames } from "utils";

const Schedule: FunctionComponent<ScheduleProps> = ({ title, schedules }) => {
    const colors = ["bg-blue-400", "bg-red-400", "bg-purple-400", "bg-pink-400", "bg-indigo-400", "bg-green-400", "bg-yellow-400"];

    return (
        <div className="flex flex-col grow gap-2">
            <h5 className="font-semibold text-gray-800">
                {title}
            </h5>
            <div className="flex flex-col gap-3 h-full">
                {schedules.length === 0 && (
                    <div className="h-full flex items-center justify-center text-sm text-gray-600">
                        Nothing to see here
                    </div>
                )}
                {schedules.map(({ name, time, questions }, scheduleIdx) => (
                    <div
                        key={scheduleIdx}
                        className="flex gap-4 p-3 rounded-xl cursor-pointer hover:bg-gray-100"
                    >
                        <div className={classNames("flex shrink-0 items-center justify-center rounded-full shadow-xl w-12 h-12 text-white font-medium", colors[Math.floor(Math.random() * colors.length)])}>
                            {name.split(' ', 2).map(word => word[0])}
                        </div>
                        <div className="flex flex-col gap-0.5 items-start justify-center">
                            <span className="block truncate font-medium text-sm tracking-wide text-gray-700">
                                {name}
                            </span>
                            <span className="block truncate text-xs text-gray-400">
                                {time} mins · {questions} questions
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

interface ScheduleProps {
    title: string;
    schedules: {
        name: string;
        time: number;
        questions: number;
    }[];
}

export default Schedule;
