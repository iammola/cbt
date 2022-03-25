import useSWR from "swr";
import Head from "next/head";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { NextPage } from "next";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/solid";
import {
  addMonths,
  endOfWeek,
  getDaysInMonth,
  lastDayOfMonth,
  setDate,
  startOfDay,
  startOfMonth,
  subMonths,
} from "date-fns";

import { classNames } from "utils";

import type { RouteData } from "types";
import type { EventsRangeGETData } from "types/api";

const Calendar: NextPage = () => {
  const activeYear = useMemo(() => 2021, []);
  const selectedColors = useMemo<{ [key: string]: string }>(() => ({}), []);
  const days = useMemo(() => ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], []);
  const colors = useMemo(
    () => [
      "bg-amber-400",
      "bg-indigo-400",
      "bg-cyan-400",
      "bg-pink-400",
      "bg-lime-400",
      "bg-violet-400",
      "bg-rose-400",
      "bg-teal-400",
      "bg-slate-400",
    ],
    []
  );
  const months = useMemo(
    () => [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    []
  );

  const [selectedMonth, setSelectedMonth] = useState(new Date(activeYear, new Date().getMonth()).getMonth());
  const [datesObj, setDatesObj] = useState<{
    dates: number[];
    range: number[];
    today: number;
    start: number;
    end: number;
  }>();

  const { data: events } = useSWR<RouteData<EventsRangeGETData>>(
    datesObj !== undefined ? `/api/events/range/?from=${datesObj.range[0]}&to=${datesObj.range[1]}` : null
  );

  const generateDates = useCallback(() => {
    const today = new Date();

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

    const thisMonthRange =
      today.getMonth() === selectedMonth
        ? { start, end }
        : subMonths(today, 1).getMonth() === selectedMonth
        ? { end: dates.length, start: end }
        : addMonths(today, 1).getMonth() === selectedMonth
        ? { start: 0, end: start }
        : { start: -1, end: -1 };

    setDatesObj({
      end: end.getDate(),
      dates,
      start,
      range,
      today: dates.findIndex(
        (b, i) => b === today.getDate() && (i >= thisMonthRange.start || i <= thisMonthRange.start)
      ),
    });
  }, [activeYear, selectedMonth]);

  useEffect(() => {
    generateDates();
  }, [generateDates, selectedMonth]);

  return (
    <>
      <Head>
        <title>Calendar | CBT | Grand Regal School</title>
        <meta
          name="description"
          content="Calendar | GRS CBT"
        />
      </Head>
      <section className="flex h-screen w-screen flex-col items-start justify-start overflow-hidden bg-neutral-800 py-3 px-5">
        <div className="flex w-full items-center justify-between">
          <h2 className="text-5xl">
            <span className="font-bold text-gray-100">{months[selectedMonth]}</span>{" "}
            <span className="font-normal text-gray-200">{activeYear}</span>
          </h2>
          <div className="flex items-center justify-center">
            <button
              type="button"
              onClick={() => setSelectedMonth(selectedMonth > 0 ? selectedMonth - 1 : selectedMonth)}
              className="rounded-tl-md rounded-bl-md bg-gray-200 p-2 hover:bg-gray-300 focus:outline-none"
            >
              <ChevronLeftIcon className="h-5 w-5 fill-neutral-500" />
            </button>
            <button
              type="button"
              onClick={() => setSelectedMonth(selectedMonth < 11 ? selectedMonth + 1 : selectedMonth)}
              className="rounded-tr-md rounded-br-md bg-gray-200 p-2 hover:bg-gray-300 focus:outline-none"
            >
              <ChevronRightIcon className="h-5 w-5 fill-neutral-500" />
            </button>
          </div>
        </div>
        <div className="flex w-full grow flex-col items-start justify-start">
          <div className="grid w-full grid-cols-7 py-2">
            {days.map((day, i) => (
              <span
                key={day}
                className={classNames("w-full px-3 text-right", {
                  "font-medium text-gray-400": [0, 6].includes(i),
                  "text-gray-300": ![0, 6].includes(i),
                })}
              >
                {day}
              </span>
            ))}
          </div>
          <div className="grid w-full grow grid-cols-7 grid-rows-[repeat(5,calc(100%/5))]">
            {datesObj?.dates.map((d, i, a) => {
              const isNotEndOfWeek = (i + 1) % 7 !== 0;
              const isWeekend = [i % 7, (i + 1) % 7].includes(0);
              const isNextMonth = i > datesObj.end;
              const isPreviousMonth = datesObj.start > i;
              const isNotInMonth = isNextMonth || isPreviousMonth;

              const dateEvents =
                events?.data?.filter(
                  ({ date }) =>
                    startOfDay(new Date(date)).getTime() ===
                    setDate(
                      subMonths(new Date(activeYear, selectedMonth), isPreviousMonth ? 1 : isNextMonth ? -1 : 0),
                      d
                    ).getTime()
                ) ?? [];
              const eventsLength = dateEvents.map(({ events }) => events.length).reduce((a, b) => a + b, 0);

              return (
                <div
                  key={i}
                  className={classNames(
                    "flex w-full flex-col items-end justify-start overflow-hidden border-t border-white/10 pt-1.5 pr-1",
                    {
                      "bg-white/5": isWeekend,
                      "border-r": isNotEndOfWeek,
                      "border-b": i + 7 >= a.length,
                      "text-gray-200": !isWeekend,
                      "text-gray-400/50": isNotInMonth,
                      "text-gray-400": !isNotInMonth && isWeekend,
                    }
                  )}
                >
                  <span
                    className={classNames(
                      "-mt-1 -mr-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-center",
                      {
                        "bg-red-500 text-sm font-semibold text-gray-800": i === datesObj.today,
                      }
                    )}
                  >
                    {d}
                  </span>
                  <div className="flex w-full grow flex-col items-start justify-start pl-2 empty:hidden">
                    {dateEvents
                      .map(({ time, events }) =>
                        events.map((event) => (
                          <div
                            key={event}
                            className="flex w-full items-center justify-start gap-1.5"
                          >
                            <span
                              aria-hidden="true"
                              className={classNames(
                                "h-1.5 w-1.5 shrink-0 rounded-full",
                                (selectedColors[event.split(" ", 1)[0]] ??= colors.splice(
                                  Math.floor(Math.random() * colors.length),
                                  1
                                )[0])
                              )}
                            />
                            <span className="block grow truncate text-xs tracking-wide text-gray-50">{event}</span>
                            <span className="shrink-0 text-[0.625rem] tracking-wider text-gray-200">{time}</span>
                          </div>
                        ))
                      )
                      .flat()
                      .slice(0, 5)}
                    {eventsLength > 5 && (
                      <span className="w-full pl-3 text-xs font-semibold text-gray-400">
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
};

export default Calendar;
