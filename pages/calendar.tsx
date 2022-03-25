import Head from "next/head";
import { useEffect, useState } from "react";
import { endOfWeek, getDaysInMonth, lastDayOfMonth, setDate, startOfMonth, subMonths } from "date-fns";

import { Days, Dates, Header } from "components/Calendar";

import type { NextPage } from "next";

const Calendar: NextPage = () => {
  const [datesObj, setDatesObj] = useState<Data[]>([]);
  const [activeMonth, setActiveMonth] = useState(startOfMonth(new Date()));

  useEffect(() => {
    function lastMonth(start: number, month: Date) {
      const data = [];
      const lastMonth = subMonths(month, 1);
      const daysInMonth = getDaysInMonth(lastMonth) - start;

      for (let i = 1; i <= start; i++) {
        const value = daysInMonth + i;

        data.push({
          value,
          date: setDate(lastMonth, value),
        });
      }

      return data;
    }

    function nextMonth(month: Date) {
      const data = [];
      const nextMonth = subMonths(month, -1);

      for (let value = 1; value <= endOfWeek(nextMonth).getDate(); value++)
        data.push({
          value,
          date: setDate(nextMonth, value),
        });

      return data;
    }

    const dates: Data[] = [];
    const start = startOfMonth(activeMonth).getDay();

    if (start > 0) dates.push(...lastMonth(start, activeMonth));

    for (let value = 1; value <= getDaysInMonth(activeMonth); value++) {
      dates.push({
        value,
        date: setDate(activeMonth, value),
      });
    }

    if (lastDayOfMonth(activeMonth).getDay() < 6) dates.push(...nextMonth(activeMonth));

    setDatesObj(dates);
  }, [activeMonth]);

  return (
    <section className="flex h-screen w-screen flex-col items-start justify-start overflow-hidden bg-neutral-800 py-3 px-5">
      <Head>
        <title>Calendar | CBT | Grand Regal School</title>
        <meta
          name="description"
          content="Calendar | GRS CBT"
        />
      </Head>
      <Header
        date={activeMonth}
        monthPrev={() => setActiveMonth(subMonths(activeMonth, 1))}
        monthNext={() => setActiveMonth(subMonths(activeMonth, -1))}
      />
      <div className="flex w-full grow flex-col items-start justify-start">
        <Days />
        <Dates
          dates={datesObj}
          date={activeMonth}
        />
      </div>
    </section>
  );
};

interface Data {
  value: number;
  date: Date;
}

export default Calendar;
