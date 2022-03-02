import { useRouter } from "next/router";
import { useCookies } from "react-cookie";
import { FunctionComponent, useEffect, useState } from "react";
import {
  formatDuration,
  intervalToDuration,
  minutesToMilliseconds,
} from "date-fns";

import type { StudentTimerProps } from "types";

type PageCookie = {
  timeBounds: { left: number; start: number; examId: string };
};

const Timer: FunctionComponent<StudentTimerProps> = ({
  started,
  submit,
  timeout,
}) => {
  const router = useRouter();
  const [displayTime, setDisplay] = useState("");
  const [{ timeBounds }, setCookies] = useCookies<
    "timeBounds",
    Partial<PageCookie>
  >(["timeBounds"]);
  const [timeLeft, setTimeLeft] = useState(timeBounds?.left ?? 0);

  useEffect(() => {
    if (started === true && (timeBounds === undefined || displayTime === "")) {
      const obj = {
        start: Date.now(),
        examId: router.query.id as string,
        left: minutesToMilliseconds(timeout ?? 1 / 12),
      };
      if (displayTime === "" && timeBounds?.examId === obj.examId)
        obj.left = timeBounds.left;

      if (obj.left > (timeBounds?.left ?? 0)) setTimeLeft(obj.left);
      if (timeBounds === undefined)
        setCookies("timeBounds", JSON.stringify(obj), { path: "/" });
    }
  }, [displayTime, router.query.id, setCookies, started, timeBounds, timeout]);

  useEffect(() => {
    if (started === true && (timeBounds?.left ?? 0) > 0)
      setDisplay(
        `${formatDuration(
          intervalToDuration({
            start: timeBounds?.start ?? 0,
            end: (timeBounds?.start ?? 0) + timeLeft,
          })
        )} left`
      );
  }, [started, timeBounds?.left, timeBounds?.start, timeLeft]);

  useEffect(() => {
    function timeUp(timer?: number) {
      submit();
      setTimeLeft(0);
      clearInterval(timer);
      setDisplay("Time's up!! 🙅‍♂️");
    }

    if (started === true && timeBounds !== undefined) {
      if (timeLeft > 0) {
        const timer = setInterval(() => {
          if (timeLeft === 1e3) setTimeout(timeUp, 1e3, timer);
          setTimeLeft((timeLeft) => timeLeft - 1e3);

          setCookies(
            "timeBounds",
            JSON.stringify({
              left: timeLeft,
              start: timeBounds.start,
              examId: timeBounds.examId,
            }),
            { path: "/" }
          );
        }, 1e3);

        return () => clearInterval(timer);
      }
      timeUp();
    }
  }, [setCookies, started, submit, timeBounds, timeLeft]);

  return (
    <div className="fixed right-6 top-20 rounded-md bg-white py-3 px-4 text-sm font-medium text-gray-700 shadow-md empty:hidden">
      {displayTime}
    </div>
  );
};

export default Timer;
