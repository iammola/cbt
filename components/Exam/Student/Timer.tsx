import { useCookies } from "react-cookie";
import { FunctionComponent, useEffect, useState } from "react";
import { addMinutes, formatDuration, intervalToDuration } from "date-fns";

import type { StudentTimerProps } from "types";

const Timer: FunctionComponent<StudentTimerProps> = ({ started, submit, timeout }) => {
    const [displayTime, setDisplay] = useState('');
    const [{ examBounds }, setCookies] = useCookies(['examBounds']);

    useEffect(() => {
        if (started === true) {
            const end = new Date(examBounds?.end ?? addMinutes(new Date(), timeout ?? 1/12));

            if (examBounds === undefined) setCookies("examBounds", JSON.stringify({ end, start: new Date() }), { path: '/' });

            const timer = setInterval(() => {
                const start = new Date();

                if (end < start) {
                    clearInterval(timer);
                    setTimeout(submit, 1e3);
                    setDisplay("Time's up!! 🙅‍♂️");
                } else {
                    const time = formatDuration(intervalToDuration({ end, start }));
                    setDisplay(`${time} left`);
                }
            }, 1e3);

            return () => clearInterval(timer);
        }
    }, [examBounds, setCookies, started, submit, timeout]);

    return (
        <div className="fixed right-6 top-20 py-3 px-4 rounded-md shadow-md bg-white text-sm font-medium text-gray-700">
            {displayTime}
        </div>
    );
}

export default Timer;
