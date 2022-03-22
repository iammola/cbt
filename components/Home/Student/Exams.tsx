import useSWR from "swr";
import Link from "next/link";
import { format, isPast } from "date-fns";
import { useCookies } from "react-cookie";
import { FunctionComponent } from "react";
import { LockClosedIcon } from "@heroicons/react/solid";

import ErrorPage from "./Error";
import EmptyPage from "./Empty";
import { Card, Cards, Section, Title } from "./Section";

import type { RouteData } from "types";
import type { StudentExamsGETData } from "types/api";

const Exam: FunctionComponent = () => {
  const [{ account }] = useCookies(["account"]);
  const { data: { data } = {}, error } = useSWR<RouteData<StudentExamsGETData>>(`/api/students/${account._id}/exams/`);

  return (
    <Section>
      <Title>Scheduled Exams</Title>
      <Cards>
        {data?.map((item, idx) => (
          <Card
            key={idx}
            className="h-56 gap-y-5"
          >
            <h5 className="text-2xl font-bold text-gray-700 line-clamp-2">{item.subject}</h5>
            <ul className="w-full list-inside list-disc space-y-1">
              {[
                [item.questions, "questions"],
                [item.duration, "minutes"],
                [format(new Date(item.date), "EEEE, dd MMM yyyy")],
              ].map(([val, key]) => (
                <li
                  key={key}
                  className="text-sm text-slate-700"
                >
                  <span className="font-medium">{val}</span> {key}
                </li>
              ))}
            </ul>
            {isPast(new Date(item.date)) ? (
              <Link href={`/exams/write/${String(item._id)}`}>
                <a className="w-full cursor-pointer rounded-full bg-blue-500 py-2 px-8 text-sm text-white hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white">
                  Start Exam
                </a>
              </Link>
            ) : (
              <button
                type="button"
                className="flex w-full cursor-pointer gap-x-4 rounded-full bg-gray-500 py-2 px-8 text-sm text-white"
              >
                <LockClosedIcon className="h-5 w-5 fill-white" />
                Locked
              </button>
            )}
          </Card>
        ))}
        {data && !data.length && <EmptyPage message="No exams to write" />}
        {error && <ErrorPage message="Error loading exams!!! Retrying..." />}
        {!data?.length && new Array(4).fill(0).map((_, i) => <Skeleton key={i} />)}
      </Cards>
    </Section>
  );
};

const Skeleton: FunctionComponent = () => {
  return (
    <aside className="w-[300px] space-y-5 rounded-xl bg-white px-5 py-4 shadow">
      <div className="h-4 w-full animate-pulse rounded-full bg-slate-300" />
      <div className="w-full space-y-2">
        <div className="h-2 w-2/5 animate-pulse rounded-full bg-slate-300" />
        <div className="h-2 w-3/5 animate-pulse rounded-full bg-slate-300" />
        <div className="h-2 w-4/5 animate-pulse rounded-full bg-slate-300" />
      </div>
      <div className="w-full animate-pulse rounded-full bg-slate-300 py-2" />
    </aside>
  );
};

export default Exam;
