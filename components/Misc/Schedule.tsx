import { FunctionComponent } from "react";
const Schedule: FunctionComponent<ScheduleProps> = ({ title, schedules }) => {

    return (
        <div className="flex flex-col gap-2">
            <h5 className="font-semibold text-gray-800">
                Today
            </h5>
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