import { useCookies } from "react-cookie";
import { FunctionComponent, useEffect, useState } from "react";
import { addMinutes, formatDuration, intervalToDuration } from "date-fns";

import type { StudentTimerProps } from "types";

const Timer: FunctionComponent<StudentTimerProps> = ({ timeout }) => {
    const [displayTime, setDisplay] = useState('');
    const [{ examBounds }, setCookies] = useCookies(['examBounds']);

    useEffect(() => {
        const end = new Date(examBounds?.end ?? addMinutes(new Date(), timeout));

        if (examBounds === undefined) setCookies("examBounds", JSON.stringify({ end, start: new Date() }), { path: '/' });

        const timer = setInterval(() => {
            const start = new Date();
            
            if (end < start) {
                // TODO: Use this component to start exam with a function call. - Report time allowed has elapsed
                clearInterval(timer);
                setDisplay("Time's up!! 🙅‍♂️");
            } else {
                const time = formatDuration(intervalToDuration({ end, start }));
                setDisplay(`${time} left`);
            }
        }, 1e3);

        return () => clearInterval(timer);
    }, [setCookies, examBounds, timeout]);

    return (
        <div className="fixed right-6 top-20 py-3 px-4 rounded-md shadow-md bg-white text-sm font-medium text-gray-700">
            {displayTime}
        </div>
    );
}

export default Timer;
