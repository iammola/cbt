import Head from "next/head";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import useSWRImmutable from "swr/immutable";
import { Fragment, useEffect, useState } from "react";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/outline";

import { classNames } from "utils";
import { Divide } from "components/Misc";
import { LoadingIcon } from "components/Misc/Icons";
import { GradingScheme, Header, TranscriptInfo, TranscriptFooter } from "components/Result";

import type { RouteData } from "types";
import type { StudentGETData, StudentTranscriptGETData } from "types/api/students";

const ResultTranscript: NextPage = () => {
  const router = useRouter();
  const [errors, setErrors] = useState<string[]>([]);
  const { data, error } = useSWRImmutable<RouteData<StudentTranscriptGETData>>(
    router.isReady && `/api/students/${router.query.id}/results/transcript/`,
    (url) => fetch(url ?? "").then((res) => res.json())
  );
  const { data: student, error: studentError } = useSWRImmutable<RouteData<StudentGETData>>(
    router.isReady && `/api/students/${router.query.id}/?select=gender birthday name.full`,
    (url) => fetch(url ?? "").then((res) => res.json())
  );

  useEffect(() => {
    if (error) setErrors((errors) => [...new Set([...errors, "data"])]);
    if (studentError) setErrors((errors) => [...new Set([...errors, "student"])]);
  }, [error, studentError]);

  return (
    <section className="flex min-h-screen w-screen items-center justify-center bg-gray-200 py-16 print:bg-white print:p-0">
      <Head>
        <title>{student?.data?.name.full ?? "Loading student's"} Transcript | Grand Regal School</title>
        <meta
          name="description"
          content="Student • Transcript | GRS CBT"
        />
      </Head>
      <main className="flex aspect-[1/1.4142] w-[60rem] flex-col items-center justify-start rounded-lg bg-white p-12 shadow-xl shadow-gray-500/30 print:rounded-none print:px-8 print:py-5 print:shadow-none">
        <Header />
        <Divide
          className="w-full py-7"
          HRclassName="border-t-gray-300"
        />
        <TranscriptInfo
          gender={student?.data?.gender}
          name={student?.data?.name.full}
          birthday={student?.data?.birthday}
        />
        <Divide
          className="w-full py-10"
          HRclassName="border-t-gray-300"
        />
        <table className="min-w-full table-fixed border-separate overflow-hidden rounded-lg border border-gray-400 bg-white [border-spacing:0;]">
          <thead className="bg-gray-50 text-sm text-gray-700">
            <tr className="divide-x divide-gray-400">
              <th
                scope="col"
                rowSpan={3}
                className="border-b border-gray-400 py-5"
              >
                <span className="sr-only">Subjects / Sessions</span>
              </th>
              <th
                colSpan={1000000}
                className="border-b border-gray-400 py-2 font-normal"
              >
                Yearly Summaries (Scores &amp; Grade)
              </th>
            </tr>
            <tr>
              {data?.data.sessions.map((session) => (
                <th
                  colSpan={2}
                  key={String(session._id)}
                  className="border-l border-gray-400 py-2 font-normal"
                >
                  {session.name}
                </th>
              ))}
            </tr>
            <tr>
              {data?.data.sessions.map(() => (
                <>
                  <th
                    scope="col"
                    className="border-l border-b border-slate-400 font-normal"
                  >
                    Score
                  </th>
                  <th
                    scope="col"
                    className="border-b border-slate-400 font-normal"
                  >
                    Grade
                  </th>
                </>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-400 bg-white text-gray-600">
            {Object.entries(data?.data.scores ?? {}).map(([subject, values], idx) => (
              <tr
                key={subject}
                className={classNames("divide-x divide-gray-400 text-center text-xs font-medium text-gray-800", {
                  "bg-gray-100": idx % 2 === 1,
                })}
              >
                <td className="px-2 py-4 font-normal text-gray-700 print:text-center">{subject}</td>
                {values.map((i) => (
                  <Fragment key={String(i.session)}>
                    <td className="w-20 py-4 print:w-12">{i.score ?? "-"}</td>
                    <td className="w-20 py-4 print:w-12">{i.grade ?? "-"}</td>
                  </Fragment>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <Divide
          className="w-full py-10"
          HRclassName="border-t-gray-300"
        />
        <div className="flex items-center justify-between gap-x-10">
          <GradingScheme
            className="w-5/12"
            scheme={data?.data?.grading ?? []}
          />
          <div className="w-7/12">
            <TranscriptFooter />
          </div>
        </div>
      </main>
      {Object.values({ student, data }).includes(undefined) && (
        <div className="fixed inset-0 z-[10000] flex h-screen w-screen flex-col items-center justify-center gap-y-10 bg-white text-3xl tracking-wide text-slate-600">
          Loading Transcript Data...
          <ul className="space-y-3 text-sm">
            {Object.entries({ student, data }).map(([key, val]) => (
              <li
                key={key}
                className={classNames("flex items-center justify-start gap-x-4", {
                  "text-emerald-500": val,
                  "text-red-500": errors.includes(key),
                  "text-blue-500": !val && !errors.includes(key),
                })}
              >
                {!val && !errors.includes(key) && <LoadingIcon className="h-5 w-5 animate-spin stroke-blue-500" />}
                {val && <CheckCircleIcon className="h-5 w-5 stroke-emerald-500" />}
                {errors.includes(key) && <XCircleIcon className="h-5 w-5 stroke-red-500" />}
                <span className="capitalize">{key}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
};

export default ResultTranscript;
