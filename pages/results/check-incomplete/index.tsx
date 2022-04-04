import Head from "next/head";
import type { NextPage } from "next";

import { Sidebar } from "components/Layout";

const CheckIncompleteResults: NextPage = () => {
  return (
    <section className="flex h-screen w-screen items-center justify-start divide-y-[1.5px] divide-gray-200">
      <Sidebar />
      <Head>
        <title>Check Incomplete Results | CBT | Grand Regal School</title>
        <meta
          name="description"
          content="Incomplete Results | GRS CBT"
        />
      </Head>
      <section className="flex h-screen w-screen grow flex-col items-center justify-center gap-7">
        <h3 className="text-center text-5xl font-bold tracking-wider text-gray-600">
          <span className="block">Check incomplete results</span>
        </h3>
      </section>
    </section>
  );
};

export default CheckIncompleteResults;
