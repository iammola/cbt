import { useCookies } from "react-cookie";
import { FunctionComponent, useEffect, useState } from "react";
import { addMinutes, formatDuration, intervalToDuration } from "date-fns";

import type { StudentTimerProps } from "types";

const Timer: FunctionComponent<StudentTimerProps> = ({ started, submit, timeout }) => {
    const [displayTime, setDisplay] = useState('');
    const [{ timeBounds }, setCookies] = useCookies<"timeBounds", { timeBounds: { end: Date, start: Date } }>(['timeBounds']);

    useEffect(() => {
        if (started === true) {
            const end = new Date(timeBounds?.end ?? addMinutes(new Date(), timeout ?? 1/12));

            if (timeBounds === undefined) setCookies("timeBounds", JSON.stringify({ end, start: new Date() }), { path: '/exam/write' });

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
    }, [timeBounds, setCookies, started, submit, timeout]);

    return (
        <div className="fixed right-6 top-20 py-3 px-4 rounded-md shadow-md bg-white text-sm font-medium text-gray-700">
            {displayTime}
        </div>
    );
}

export default Timer;
