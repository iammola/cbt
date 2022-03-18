import Head from "next/head";
import type { NextPage } from "next";

import { Divide } from "components/Misc";
import { Header, TranscriptInfo } from "components/Result";

const ResultTranscript: NextPage = () => {
  return (
    <section className="flex min-h-screen w-screen items-center justify-center bg-gray-200 py-16 print:bg-white print:p-0">
      <Head>
        <title>John Doe Transcript | Grand Regal School</title>
        <meta name="description" content="Student • Transcript | GRS CBT" />
      </Head>
      <main className="flex aspect-[1/1.4142] w-[60rem] flex-col items-center justify-start rounded-lg bg-white p-12 shadow-xl shadow-gray-500/30 print:rounded-none print:px-8 print:py-5 print:shadow-none">
        <Header />
        <Divide className="w-full py-7" HRclassName="border-t-gray-300" />
        <TranscriptInfo
          gender="M"
          name="John Doe"
          birthday={new Date(2004, 11, 10)}
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
              <th colSpan={2} className="border-l border-gray-400 font-normal">
                <div>Year 1</div>
                <div>2017</div>
              </th>
              <th colSpan={2} className="border-l border-gray-400 font-normal">
                <div>Year 2</div>
                <div>2018</div>
              </th>
            </tr>
            <tr>
              <th
                scope="col"
                className="border-l border-b border-slate-400 font-normal"
              >
                Score
              </th>
              <th scope="col" className="border-b border-slate-400 font-normal">
                Grade
              </th>
              <th
                scope="col"
                className="border-l border-b border-slate-400 font-normal"
              >
                Score
              </th>
              <th scope="col" className="border-b border-slate-400 font-normal">
                Grade
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-400 bg-white text-gray-600">
            <tr className="divide-x divide-gray-400 text-center text-xs font-medium text-gray-800">
              <td className="px-2 py-4 font-normal text-gray-700 print:text-center">
                Mathematics
              </td>
              <td className="w-20 py-4 print:w-12">80</td>
              <td className="w-20 py-4 print:w-12">B</td>
              <td className="w-20 py-4 print:w-12">88</td>
              <td className="w-20 py-4 print:w-12">A</td>
            </tr>
          </tbody>
        </table>
        <Divide className="w-full py-10" HRclassName="border-t-gray-300" />
      </main>
    </section>
  );
};

export default ResultTranscript;
