import Head from "next/head";
import { useCallback, useEffect, useState } from "react";
import type { NextPage } from "next";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/solid";
import { addMonths, endOfWeek, getDaysInMonth, isThisMonth, lastDayOfMonth, startOfMonth, subMonths } from "date-fns";

import { classNames } from "utils";

const Calendar: NextPage = () => {
    const activeYear = 2021;
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const [selectedMonth, setSelectedMonth] = useState(new Date(activeYear, new Date().getMonth()).getMonth());
    const [datesObj, setDatesObj] = useState<{ dates: number[]; today: number; start: number; end: number; }>();

    const generateDates = useCallback(() => {
        const dates: number[] = [];
        const date = new Date(activeYear, selectedMonth);

        const end = lastDayOfMonth(date);
        const start = startOfMonth(date).getDay();

        if (start > 0) {
            const lastMonth = getDaysInMonth(subMonths(date, 1));
            for (let i = 1; i <= start; i++) dates.push(lastMonth - start + i);
        }

        for (let i = 1; i <= getDaysInMonth(date); i++) dates.push(i);

        if (end.getDay() < 6) {
            const nextMonthFirstWeek = endOfWeek(addMonths(date, 1));
            for (let i = 1; i <= nextMonthFirstWeek.getDate(); i++) dates.push(i);
        }

        setDatesObj({
            dates, start,
            end: end.getDate(),
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
                        <div className="flex flex-col justify-start items-end w-full border-t border-r border-white/10 text-gray-400 bg-white/5 pt-1.5 pr-1">
                            <span className="flex items-center justify-center w-8 h-8 shrink-0 -mt-1 -mr-0.5 text-sm text-center rounded-full">
                                31
                            </span>
                        </div>
                        <div className="flex flex-col justify-start items-end w-full border-t border-r border-white/10 text-gray-200 pt-1.5 pr-1">
                            <span className="flex items-center justify-center w-8 h-8 shrink-0 -mt-1 -mr-0.5 text-sm text-center rounded-full">
                                1
                            </span>
                        </div>
                        <div className="flex flex-col justify-start items-end w-full border-t border-r border-white/10 text-gray-200 pt-1.5 pr-1">
                            <span className="flex items-center justify-center w-8 h-8 shrink-0 -mt-1 -mr-0.5 text-sm text-center rounded-full">
                                2
                            </span>
                        </div>
                        <div className="flex flex-col justify-start items-end w-full border-t border-r border-white/10 text-gray-200 pt-1.5 pr-1">
                            <span className="flex items-center justify-center w-8 h-8 shrink-0 -mt-1 -mr-0.5 text-sm text-center rounded-full">
                                3
                            </span>
                        </div>
                        <div className="flex flex-col justify-start items-end w-full border-t border-r border-white/10 text-gray-200 pt-1.5 pr-1">
                            <span className="flex items-center justify-center w-8 h-8 shrink-0 -mt-1 -mr-0.5 text-sm text-center rounded-full">
                                4
                            </span>
                        </div>
                        <div className="flex flex-col justify-start items-end w-full border-t border-r border-white/10 text-gray-200 pt-1.5 pr-1">
                            <span className="flex items-center justify-center w-8 h-8 shrink-0 -mt-1 -mr-0.5 text-sm text-center rounded-full">
                                5
                            </span>
                        </div>
                        <div className="flex flex-col justify-start items-end w-full border-t border-r-0 border-white/10 text-gray-400 bg-white/5 pt-1.5 pr-1">
                            <span className="flex items-center justify-center w-8 h-8 shrink-0 -mt-1 -mr-0.5 text-sm text-center rounded-full">
                                6
                            </span>
                        </div>
                        <div className="flex flex-col justify-start items-end w-full border-t border-r border-white/10 text-gray-400 bg-white/5 pt-1.5 pr-1">
                            <span className="flex items-center justify-center w-8 h-8 shrink-0 -mt-1 -mr-0.5 text-sm text-center rounded-full">
                                7
                            </span>
                        </div>
                        <div className="flex flex-col justify-start items-end w-full border-t border-r border-white/10 text-gray-200 pt-1.5 pr-1">
                            <span className="flex items-center justify-center w-8 h-8 shrink-0 -mt-1 -mr-0.5 text-sm text-center rounded-full">
                                8
                            </span>
                        </div>
                        <div className="flex flex-col justify-start items-end w-full border-t border-r border-white/10 text-gray-200 pt-1.5 pr-1">
                            <span className="flex items-center justify-center w-8 h-8 shrink-0 -mt-1 -mr-0.5 text-sm text-center rounded-full">
                                9
                            </span>
                        </div>
                        <div className="flex flex-col justify-start items-end w-full border-t border-r border-white/10 text-gray-200 pt-1.5 pr-1">
                            <span className="flex items-center justify-center w-8 h-8 shrink-0 -mt-1 -mr-0.5 text-sm text-center rounded-full">
                                10
                            </span>
                        </div>
                        <div className="flex flex-col justify-start items-end w-full border-t border-r border-white/10 text-gray-200 pt-1.5 pr-1">
                            <span className="flex items-center justify-center w-8 h-8 shrink-0 -mt-1 -mr-0.5 text-sm text-center rounded-full">
                                11
                            </span>
                        </div>
                        <div className="flex flex-col justify-start items-end w-full border-t border-r border-white/10 text-gray-200 pt-1.5 pr-1">
                            <span className="flex items-center justify-center w-8 h-8 shrink-0 -mt-1 -mr-0.5 text-sm text-center rounded-full">
                                12
                            </span>
                        </div>
                        <div className="flex flex-col justify-start items-end w-full border-t border-r-0 border-white/10 text-gray-400 bg-white/5 pt-1.5 pr-1">
                            <span className="flex items-center justify-center w-8 h-8 shrink-0 -mt-1 -mr-0.5 text-sm text-center rounded-full">
                                13
                            </span>
                        </div>
                        <div className="flex flex-col justify-start items-end w-full border-t border-r border-white/10 text-gray-400 bg-white/5 pt-1.5 pr-1">
                            <span className="flex items-center justify-center w-8 h-8 shrink-0 -mt-1 -mr-0.5 text-sm text-center rounded-full">
                                14
                            </span>
                        </div>
                        <div className="flex flex-col justify-start items-end w-full border-t border-r border-white/10 text-gray-200 pt-1.5 pr-1">
                            <span className="flex items-center justify-center w-8 h-8 shrink-0 -mt-1 -mr-0.5 text-sm text-center rounded-full">
                                15
                            </span>
                        </div>
                        <div className="flex flex-col justify-start items-end w-full border-t border-r border-white/10 text-gray-200 pt-1.5 pr-1">
                            <span className="flex items-center justify-center w-8 h-8 shrink-0 -mt-1 -mr-0.5 text-sm text-center rounded-full">
                                16
                            </span>
                        </div>
                        <div className="flex flex-col justify-start items-end w-full border-t border-r border-white/10 text-gray-200 pt-1.5 pr-1">
                            <span className="flex items-center justify-center w-8 h-8 shrink-0 -mt-1 -mr-0.5 text-sm text-center rounded-full">
                                17
                            </span>
                        </div>
                        <div className="flex flex-col justify-start items-end w-full border-t border-r border-white/10 text-gray-200 pt-1.5 pr-1">
                            <span className="flex items-center justify-center w-8 h-8 shrink-0 -mt-1 -mr-0.5 text-sm text-center rounded-full">
                                18
                            </span>
                        </div>
                        <div className="flex flex-col justify-start items-end w-full border-t border-r border-white/10 text-gray-200 pt-1.5 pr-1">
                            <span className="flex items-center justify-center w-8 h-8 shrink-0 -mt-1 -mr-0.5 text-sm text-center rounded-full">
                                19
                            </span>
                        </div>
                        <div className="flex flex-col justify-start items-end w-full border-t border-r-0 border-white/10 text-gray-400 bg-white/5 pt-1.5 pr-1">
                            <span className="flex items-center justify-center w-8 h-8 shrink-0 -mt-1 -mr-0.5 text-sm text-center rounded-full">
                                20
                            </span>
                        </div>
                        <div className="flex flex-col justify-start items-end w-full border-t border-r border-white/10 text-gray-400 bg-white/5 pt-1.5 pr-1">
                            <span className="flex items-center justify-center w-8 h-8 shrink-0 -mt-1 -mr-0.5 text-sm text-center rounded-full">
                                21
                            </span>
                        </div>
                        <div className="flex flex-col justify-start items-end w-full border-t border-r border-white/10 text-gray-200 pt-1.5 pr-1">
                            <span className="flex items-center justify-center w-8 h-8 shrink-0 -mt-1 -mr-0.5 text-sm text-center rounded-full">
                                22
                            </span>
                        </div>
                        <div className="flex flex-col justify-start items-end w-full border-t border-r border-white/10 text-gray-200 pt-1.5 pr-1">
                            <span className="flex items-center justify-center w-8 h-8 shrink-0 -mt-1 -mr-0.5 text-sm text-center rounded-full">
                                23
                            </span>
                        </div>
                        <div className="flex flex-col justify-start items-end w-full border-t border-r border-white/10 text-gray-200 pt-1.5 pr-1">
                            <span className="flex items-center justify-center w-8 h-8 shrink-0 -mt-1 -mr-0.5 text-sm text-center rounded-full">
                                24
                            </span>
                        </div>
                        <div className="flex flex-col justify-start items-end w-full border-t border-r border-white/10 text-gray-200 pt-1.5 pr-1">
                            <span className="flex items-center justify-center w-8 h-8 shrink-0 -mt-1 -mr-0.5 text-sm text-center rounded-full">
                                25
                            </span>
                        </div>
                        <div className="flex flex-col justify-start items-end w-full border-t border-r border-white/10 text-gray-200 pt-1.5 pr-1">
                            <span className="flex items-center justify-center w-8 h-8 shrink-0 -mt-1 -mr-0.5 text-sm text-center rounded-full">
                                26
                            </span>
                        </div>
                        <div className="flex flex-col justify-start items-end w-full border-t border-r-0 border-white/10 text-gray-400 bg-white/5 pt-1.5 pr-1">
                            <span className="flex items-center justify-center w-8 h-8 shrink-0 -mt-1 -mr-0.5 text-sm text-center rounded-full bg-red-500 text-gray-800 font-semibold">
                                27
                            </span>
                        </div>
                        <div className="flex flex-col justify-start items-end w-full border-t border-r border-b border-white/10 text-gray-400 bg-white/5 pt-1.5 pr-1">
                            <span className="flex items-center justify-center w-8 h-8 shrink-0 -mt-1 -mr-0.5 text-sm text-center rounded-full">
                                28
                            </span>
                        </div>
                        <div className="flex flex-col justify-start items-end w-full border-t border-r border-b border-white/10 text-gray-200 pt-1.5 pr-1">
                            <span className="flex items-center justify-center w-8 h-8 shrink-0 -mt-1 -mr-0.5 text-sm text-center rounded-full">
                                29
                            </span>
                    <div className="grid grid-cols-7 grid-rows-[repeat(5,calc(100%/5))] grow w-full">
                            <div className="flex flex-col items-start justify-start grow w-full pl-2">
                                <div className="flex items-center justify-start gap-1.5 w-full">
                                    <span
                                        aria-hidden="true"
                                        className="w-1.5 h-1.5 bg-lime-400 rounded-full shrink-0"
                                    />
                                    <span className="grow block truncate text-gray-50 text-xs tracking-wide">
                                        JC3 Mathematics
                                    </span>
                                    <span className="shrink-0 text-gray-200 text-[0.625rem] tracking-wider">
                                        5:30 PM
                                    </span>
                                </div>
                                <div className="flex items-center justify-start gap-1.5 w-full">
                                    <span
                                        aria-hidden="true"
                                        className="w-1.5 h-1.5 bg-pink-400 rounded-full shrink-0"
                                    />
                                    <span className="grow block truncate text-gray-50 text-xs tracking-wide">
                                        JC2 English Language
                                    </span>
                                    <span className="shrink-0 text-gray-200 text-[0.625rem] tracking-wider">
                                        8:30 AM
                                    </span>
                                </div>
                                <div className="flex items-center justify-start gap-1.5 w-full">
                                    <span
                                        aria-hidden="true"
                                        className="w-1.5 h-1.5 bg-cyan-400 rounded-full shrink-0"
                                    />
                                    <span className="grow block truncate text-gray-50 text-xs tracking-wide">
                                        JC1 Pre-Vocational Studies
                                    </span>
                                    <span className="shrink-0 text-gray-200 text-[0.625rem] tracking-wider">
                                        12:30 PM
                                    </span>
                                </div>
                                <div className="flex items-center justify-start gap-1.5 w-full">
                                    <span
                                        aria-hidden="true"
                                        className="w-1.5 h-1.5 bg-indigo-400 rounded-full shrink-0"
                                    />
                                    <span className="grow block truncate text-gray-50 text-xs tracking-wide">
                                        SC2 Chemistry
                                    </span>
                                    <span className="shrink-0 text-gray-200 text-[0.625rem] tracking-wider">
                                        8:30 AM
                                    </span>
                                </div>
                                <div className="flex items-center justify-start gap-1.5 w-full">
                                    <span
                                        aria-hidden="true"
                                        className="w-1.5 h-1.5 bg-amber-400 rounded-full shrink-0"
                                    />
                                    <span className="grow block truncate text-gray-50 text-xs tracking-wide">
                                        SC1 Chemistry
                                    </span>
                                    <span className="shrink-0 text-gray-200 text-[0.625rem] tracking-wider">
                                        12:30 PM
                                    </span>
                                </div>
                                <span className="pl-3 w-full text-xs font-semibold text-gray-400">
                                    2 more...
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-col justify-start items-end w-full border-t border-r border-b border-white/10 text-gray-200 pt-1.5 pr-1">
                            <span className="flex items-center justify-center w-8 h-8 shrink-0 -mt-1 -mr-0.5 text-sm text-center rounded-full">
                                30
                            </span>
                        </div>
                        <div className="flex flex-col justify-start items-end w-full border-t border-r border-b border-white/10 text-gray-200 pt-1.5 pr-1">
                            <span className="flex items-center justify-center w-8 h-8 shrink-0 -mt-1 -mr-0.5 text-sm text-center rounded-full">
                                1
                            </span>
                        </div>
                        <div className="flex flex-col justify-start items-end w-full border-t border-r border-b border-white/10 text-gray-200 pt-1.5 pr-1">
                            <span className="flex items-center justify-center w-8 h-8 shrink-0 -mt-1 -mr-0.5 text-sm text-center rounded-full">
                                2
                            </span>
                        </div>
                        <div className="flex flex-col justify-start items-end w-full border-t border-r border-b border-white/10 text-gray-200 pt-1.5 pr-1">
                            <span className="flex items-center justify-center w-8 h-8 shrink-0 -mt-1 -mr-0.5 text-sm text-center rounded-full">
                                3
                            </span>
                        </div>
                        <div className="flex flex-col justify-start items-end w-full border-t border-r-0 border-b border-white/10 text-gray-400 bg-white/5 pt-1.5 pr-1">
                            <span className="flex items-center justify-center w-8 h-8 shrink-0 -mt-1 -mr-0.5 text-sm text-center rounded-full">
                                4
                            </span>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Calendar;
