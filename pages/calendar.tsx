import useSWR from "swr";
import Head from "next/head";
import { useCallback, useEffect, useState } from "react";
import type { NextPage } from "next";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/solid";
import { addMonths, endOfWeek, getDaysInMonth, isThisMonth, lastDayOfMonth, setDate, startOfDay, startOfMonth, subMonths } from "date-fns";

import { classNames } from "utils";

import type { RouteData } from "types";
import type { EventsRangeGETData } from "types/api/events";

const Calendar: NextPage = () => {
    const activeYear = 2021;
    const selectedColors: { [key: string]: string } = {};
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const colors = ["bg-amber-400", "bg-indigo-400", "bg-cyan-400", "bg-pink-400", "bg-lime-400"];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const [selectedMonth, setSelectedMonth] = useState(new Date(activeYear, new Date().getMonth()).getMonth());
    const [datesObj, setDatesObj] = useState<{ dates: number[]; range: number[]; today: number; start: number; end: number; }>();

    const { data: events } = useSWR<RouteData<EventsRangeGETData>>(datesObj !== undefined ? `/api/events/range?from=${datesObj.range[0]}&to=${datesObj.range[1]}` : null, url => fetch(url ?? '').then(res => res.json()));

    const generateDates = useCallback(() => {
        const dates: number[] = [];
        const date = new Date(activeYear, selectedMonth);

        const range: number[] = [];
        const end = lastDayOfMonth(date);
        const start = startOfMonth(date).getDay();

        if (start > 0) {
            const lastMonth = subMonths(date, 1);
            range.push(lastMonth.getTime());
            for (let i = 1; i <= start; i++) dates.push(getDaysInMonth(lastMonth) - start + i);
        }

        for (let i = 1; i <= getDaysInMonth(date); i++) dates.push(i);

        if (end.getDay() < 6) {
            const nextMonthFirstWeek = endOfWeek(addMonths(date, 1));
            range.push(nextMonthFirstWeek.getTime());
            for (let i = 1; i <= nextMonthFirstWeek.getDate(); i++) dates.push(i);
        }

        setDatesObj({
            end: end.getDate(),
            dates, start, range,
            today: (isThisMonth(date) ? new Date().getDate() + start : 0) - 1
        });
    }, [selectedMonth]);

    useEffect(() => {
        generateDates();
    }, [generateDates, selectedMonth]);

    return (
        <>
            <Head>
                <title>Calendar | CBT | Grand Regal School</title>
                <meta name="description" content="Calendar | GRS CBT" />
            </Head>
            <section className="flex flex-col items-start justify-start w-screen h-screen py-3 px-5 bg-neutral-800 overflow-hidden">
                <div className="flex items-center justify-between w-full">
                    <h2 className="text-5xl">
                        <span className="text-gray-100 font-bold">{months[selectedMonth]}</span>{' '}
                        <span className="text-gray-200 font-normal">{activeYear}</span>
                    </h2>
                    <div className="flex items-center justify-center">
                        <button
                            type="button"
                            className="p-2 rounded-tl-md rounded-bl-md bg-gray-200 focus:outline-none hover:bg-gray-300"
                        >
                            <ChevronLeftIcon className="w-5 h-5 fill-neutral-500" />
                        </button>
                        <button
                            type="button"
                            className="p-2 rounded-tr-md rounded-br-md bg-gray-200 focus:outline-none hover:bg-gray-300"
                        >
                            <ChevronRightIcon className="w-5 h-5 fill-neutral-500" />
                        </button>
                    </div>
                </div>
                <div className="flex flex-col items-start justify-start w-full grow">
                    <div className="grid grid-cols-7 py-2 w-full">
                        {days.map((day, i) => (
                            <span
                                key={day}
                                className={classNames("w-full text-right px-3", {
                                    "text-gray-400 font-medium": [0, 6].includes(i),
                                    "text-gray-300": ![0, 6].includes(i),
                                })}
                            >
                                {day}
                            </span>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 grid-rows-[repeat(5,calc(100%/5))] grow w-full">
                        {datesObj?.dates.map((d, i, a) => {
                            const isNotEndOfWeek = (i + 1) % 7 !== 0;
                            const isWeekend = [i % 7, (i + 1) % 7].includes(0);
                            const isNextMonth = i > datesObj.end;
                            const isPreviousMonth = datesObj.start > i;
                            const isNotInMonth = isNextMonth || isPreviousMonth;

                            const dateEvents = events?.data?.filter(({ date }) => startOfDay(new Date(date)).getTime() === setDate(subMonths(new Date(activeYear, selectedMonth), isPreviousMonth ? 1 : isNextMonth ? -1 : 0), d).getTime()) ?? [];
                            const eventsLength = dateEvents.map(({ events }) => events.length).reduce((a, b) => a + b, 0);

                            return (
                                <div
                                    key={i}
                                    className={classNames("flex flex-col justify-start items-end w-full border-t border-white/10 pt-1.5 pr-1 overflow-hidden", {
                                        "bg-white/5": isWeekend,
                                        "border-r": isNotEndOfWeek,
                                        "border-b": i + 7 >= a.length,
                                        "text-gray-200": !isWeekend,
                                        "text-gray-400/50": isNotInMonth,
                                        "text-gray-400": !isNotInMonth && isWeekend,
                                    })}
                                >
                                    <span
                                        className={classNames("flex items-center justify-center w-8 h-8 shrink-0 -mt-1 -mr-0.5 text-center rounded-full", {
                                            "bg-red-500 text-gray-800 font-semibold text-sm": i === datesObj.today
                                        })}
                                    >
                                        {d}
                                    </span>
                                    <div className="flex flex-col items-start justify-start grow w-full pl-2 empty:hidden">
                                        {dateEvents.map(({ time, events }) => events.map(event => (
                                            <div
                                                key={event}
                                                className="flex items-center justify-start gap-1.5 w-full"
                                            >
                                                <span
                                                    aria-hidden="true"
                                                    className={classNames("w-1.5 h-1.5 bg-lime-400 rounded-full shrink-0", selectedColors[event.split(' ', 1)[0]] ??= colors.splice(Math.floor(Math.random() * colors.length), 1)[0])}
                                                />
                                                <span className="grow block truncate text-gray-50 text-xs tracking-wide">
                                                    {event}
                                                </span>
                                                <span className="shrink-0 text-gray-200 text-[0.625rem] tracking-wider">
                                                    {time}
                                                </span>
                                            </div>
                                        ))).flat().slice(0, 5)}
                                        {eventsLength > 5 && (
                                            <span className="pl-3 w-full text-xs font-semibold text-gray-400">
                                                {eventsLength - 5} more...
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>
        </>
    );
}

export default Calendar;
