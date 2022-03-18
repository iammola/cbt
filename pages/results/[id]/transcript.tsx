import Head from "next/head";
import { Fragment } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import useSWRImmutable from "swr/immutable";

import { classNames } from "utils";
import { Divide } from "components/Misc";
import { Header, TranscriptInfo, TranscriptFooter } from "components/Result";

import type { RouteData } from "types";
import type {
  StudentGETData,
  StudentTranscriptGETData,
} from "types/api/students";

const ResultTranscript: NextPage = () => {
  const router = useRouter();
  const { data } = useSWRImmutable<RouteData<StudentTranscriptGETData>>(
    router.isReady && `/api/students/${router.query.id}/results/transcript/`,
    (url) => fetch(url ?? "").then((res) => res.json())
  );
  const { data: student } = useSWRImmutable<RouteData<StudentGETData>>(
    router.isReady &&
      `/api/students/${router.query.id}/?select=gender birthday name.full`,
    (url) => fetch(url ?? "").then((res) => res.json())
  );

  return (
    <section className="flex min-h-screen w-screen items-center justify-center bg-gray-200 py-16 print:bg-white print:p-0">
      <Head>
        <title>
          {student?.data?.name.full ?? "Loading student's"} Transcript | Grand
          Regal School
        </title>
        <meta name="description" content="Student • Transcript | GRS CBT" />
      </Head>
      <main className="flex aspect-[1/1.4142] w-[60rem] flex-col items-center justify-start rounded-lg bg-white p-12 shadow-xl shadow-gray-500/30 print:rounded-none print:px-8 print:py-5 print:shadow-none">
        <Header />
        <Divide className="w-full py-7" HRclassName="border-t-gray-300" />
        <TranscriptInfo
          gender={student?.data?.gender}
          name={student?.data?.name.full}
          birthday={student?.data?.birthday}
        />
        <Divide className="w-full py-10" HRclassName="border-t-gray-300" />
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
            {data?.data?.subjects.map((sub, index) => (
              <tr
                key={String(sub._id)}
                className={classNames(
                  "divide-x divide-gray-400 text-center text-xs font-medium text-gray-800",
                  { "bg-gray-100": index % 2 === 1 }
                )}
              >
                <td className="px-2 py-4 font-normal text-gray-700 print:text-center">
                  {sub.name}
                </td>
                {data?.data.scores
                  .find((sco) => sco.subject === sub._id)
                  ?.data?.map((i) => (
                    <Fragment key={String(i.session)}>
                      <td className="w-20 py-4 print:w-12">{i.score ?? "-"}</td>
                      <td className="w-20 py-4 print:w-12">{i.grade ?? "-"}</td>
                    </Fragment>
                  ))}
              </tr>
            ))}
          </tbody>
        </table>
        <Divide className="w-full py-10" HRclassName="border-t-gray-300" />
        <TranscriptFooter />
      </main>
    </section>
  );
};

export default ResultTranscript;
