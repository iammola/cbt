import Head from "next/head";
import type { NextPage } from "next";

import { Sidebar } from "components/Layout";

const CheckTypeIncompleteResults: NextPage = () => {
  return (
    <section className="flex h-screen w-screen items-center justify-start divide-y-[1.5px] divide-gray-200">
      <Sidebar />
      <Head>
        <title>Check `Type` Incomplete Results | CBT | Grand Regal School</title>
        <meta
          name="description"
          content="`Type` Incomplete Results | GRS CBT"
        />
      </Head>
      <section className="flex h-screen w-screen grow flex-col items-center justify-start gap-7">
        <h3 className="text-center text-5xl font-bold tracking-wider text-gray-600">
          <span className="block">Check `type` incomplete results</span>
        </h3>
      </section>
    </section>
  );
};

export default CheckTypeIncompleteResults;
