import { useRouter } from "next/router";
import { useCookies } from "react-cookie";
import { FunctionComponent, useEffect, useState } from "react";
import { formatDuration, intervalToDuration, minutesToMilliseconds } from "date-fns";

import type { StudentTimerProps } from "types";

type PageCookie = {
    timeBounds: { left: number; start: number; examId: string; }
};

const Timer: FunctionComponent<StudentTimerProps> = ({ started, submit, timeout }) => {
    const router = useRouter();
    const [displayTime, setDisplay] = useState('');
    const [{ timeBounds }, setCookies] = useCookies<"timeBounds", Partial<PageCookie>>(['timeBounds']);
    const [timeLeft, setTimeLeft] = useState(timeBounds?.left ?? 0);

    useEffect(() => {
        if (started === true && (timeBounds === undefined || displayTime === '')) {
            const obj = {
                start: Date.now(),
                examId: router.query.id as string,
                left: minutesToMilliseconds(timeout ?? 1 / 12)
            }
            if (displayTime === '' && timeBounds?.examId === obj.examId) obj.left = timeBounds.left;

            setTimeLeft(obj.left);
            setCookies("timeBounds", JSON.stringify(obj), { path: '/' });
        }
    }, [displayTime, router.query.id, setCookies, started, timeBounds, timeout]);

    useEffect(() => {
        if (started === true && timeBounds !== undefined) setDisplay(`${formatDuration(intervalToDuration({
            start: timeBounds.start,
            end: timeBounds.start + timeLeft
        }))} left`);
    }, [started, timeBounds, timeLeft]);

    useEffect(() => {
        if (started === true && timeBounds !== undefined) {
            const timer = setInterval(() => {
                if (timeLeft < 1e3) {
                    setTimeLeft(0);
                    clearInterval(timer);
                    setTimeout(submit, 1e3);
                    setDisplay("Time's up!! 🙅‍♂️");
                } else {
                    setTimeLeft(timeLeft => timeLeft - 1e3);
                    if (timeLeft % 1e4 === 0) setCookies("timeBounds", JSON.stringify({
                        left: timeLeft,
                        start: timeBounds.start,
                        examId: timeBounds.examId
                    }), { path: '/' });
                }
            }, 1e3);

            return () => clearInterval(timer);
        }
    }, [setCookies, started, submit, timeBounds, timeLeft]);

    return (
        <div className="fixed right-6 top-20 py-3 px-4 rounded-md shadow-md bg-white text-sm font-medium text-gray-700 empty:hidden">
            {displayTime}
        </div>
    );
}

export default Timer;
