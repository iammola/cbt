import { FunctionComponent, useMemo } from "react";
import { getDaysInMonth, getDay, isSameMonth } from "date-fns";

import { classNames } from "utils";

const Calendar: FunctionComponent<CalendarProps> = ({ month, year, events }) => {
    const days = useMemo(() => ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], []);
    const months = useMemo(() => ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"], []);
    const validToday = useMemo(() => isSameMonth(new Date(), new Date(year, month)) === true && new Date().getDate(), [month, year]);
    const formattedEvents = Object.fromEntries(events?.map(event => [event.date, event.count]) ?? [])

    function getDates(month: number, year: number) {
        let b = 0;
        let w: (number | string)[][] = [];
        const d = new Date(year, month);
        let n = getDaysInMonth(d);

        while (b < n) w.push(Array.from({ length: days.length }).map((_, i) => ((w.length > 0 || i >= getDay(d)) && b < n) ? ++b : ""));
        return w;
    }

    return (
        <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between pb-2">
                <h5 className="font-semibold text-gray-800">
                    Calendar
                </h5>
                <span className="text-gray-600 text-sm">
                    {months[month]}
                </span>
            </div>
            <div className="grid grid-cols-7 grid-rows-1 w-full text-xs text-center pb-3">
                {days.map((day, dayIdx) => (
                    <span
                        key={day}
                        className={classNames({
                            "text-gray-400": [0, days.length - 1].includes(dayIdx),
                            "text-gray-600": ![0, days.length - 1].includes(dayIdx),
                        })}
                    >
                        {day}
                    </span>
                ))}
            </div>
            <div className="flex flex-col gap-y-4 items-center justify-center w-full text-sm text-center">
                {getDates(month, year).map((week, weekIdx) => (
                    <div
                        key={weekIdx}
                        className="grid grid-cols-7 grid-rows-1 w-full"
                    >
                        {week.map((day, dayIdx) => (
                            <span
                                key={dayIdx}
                                className={classNames("group relative cursor-pointer", {
                                    "text-gray-600": ![0, days.length - 1].includes(dayIdx) && day !== validToday,
                                    "text-gray-400": [0, days.length - 1].includes(dayIdx) && day !== validToday,
                                    "text-gray-100": validToday == day
                                })}
                            >
                                {day}
                                {validToday === day ? (
                                    <span className="w-8 h-8 bg-gradient-to-br from-indigo-300 to-indigo-600 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[-1] rounded-full shadow-md" />
                                ) : (events.includes(+day) && (
                                    <>
                                        <span className="flex items-center justify-center gap-0.5 w-full absolute left-1/2 -translate-x-1/2">
                                            <span className="inline-block flex-shrink-0 w-0.5 h-0.5 bg-indigo-600 rounded-full" />
                                            <span className="inline-block flex-shrink-0 w-0.5 h-0.5 bg-indigo-600 rounded-full" />
                                            <span className="inline-block flex-shrink-0 w-0.5 h-0.5 bg-indigo-600 rounded-full" />
                                        </span>
                                        <span className="hidden group-hover:inline-block rounded-md p-2 shadow-md z-10 absolute top-[-2.25rem] -left-2 bg-white text-gray-600 text-xs font-medium w-max">
                                            {Math.ceil(Math.random() * 12)} events
                                        </span>
                                    </>
                                ))}
                            </span>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    )
}

type CalendarProps = {
    month: number;
    year: number;
    events?: {
        date: number;
        count: number;
    }[]
}

export default Calendar;
