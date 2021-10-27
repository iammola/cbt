import { FunctionComponent } from "react";

const Schedule: FunctionComponent<ScheduleProps> = () => {
    return (
        <div className="flex flex-col gap-2">
            <h5 className="font-semibold text-gray-800">
                Today
            </h5>
            <div className="flex flex-col gap-3">
                <div className="flex gap-4 p-3 rounded-xl cursor-pointer hover:bg-gray-100">
                    <div className="flex items-center justify-center rounded-full shadow-xl w-12 h-12 text-white font-medium bg-blue-400">
                        P
                    </div>
                    <div className="flex flex-col gap-0.5 items-start justify-center">
                        <span className="block truncate font-medium text-sm tracking-wide text-gray-700">
                            Physics
                        </span>
                        <span className="block truncate text-xs text-gray-400">
                            60 mins · 50 questions
                        </span>
                    </div>
                </div>
                <div className="flex gap-4 p-3 rounded-xl cursor-pointer hover:bg-gray-100">
                    <div className="flex items-center justify-center rounded-full shadow-xl w-12 h-12 text-white font-medium bg-red-400">
                        CE
                    </div>
                    <div className="flex flex-col gap-0.5 items-start justify-center">
                        <span className="block truncate font-medium text-sm tracking-wide text-gray-700">
                            Civic Education
                        </span>
                        <span className="block truncate text-xs text-gray-400">
                            60 mins · 60 questions
                        </span>
                    </div>
                </div>
                <div className="flex gap-4 p-3 rounded-xl cursor-pointer hover:bg-gray-100">
                    <div className="flex items-center justify-center rounded-full shadow-xl w-12 h-12 text-white font-medium bg-purple-400">
                        M
                    </div>
                    <div className="flex flex-col gap-0.5 items-start justify-center">
                        <span className="block truncate font-medium text-sm tracking-wide text-gray-700">
                            Mathematics
                        </span>
                        <span className="block truncate text-xs text-gray-400">
                            120 mins · 100 questions
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

interface ScheduleProps {
    schedules: {
        name: string;
        time: number;
        questions: number;
    }[];
}

export default Schedule;
