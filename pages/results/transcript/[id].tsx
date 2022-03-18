import Head from "next/head";
import type { NextPage } from "next";

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
      </main>
    </section>
  );
};

export default ResultTranscript;
