import Head from "next/head";
import type { NextPage } from "next";
import { useRouter } from "next/router";

import { Sidebar } from "components/Layout";

const CheckTypeIncompleteResults: NextPage = () => {
  const router = useRouter();

  return (
    <section className="flex h-screen w-screen items-center justify-start divide-y-[1.5px] divide-gray-200">
      <Sidebar />
      <Head>
        <title>Check {router.query.type} Incomplete Results | CBT | Grand Regal School</title>
        <meta
          name="description"
          content={`${router.query.type} Incomplete Results | GRS CBT`}
        />
      </Head>
      <section className="flex h-screen w-screen grow flex-col items-center justify-start gap-7">
        <h3 className="text-center text-5xl font-bold tracking-wider text-gray-600">
          <span className="block">Check {router.query.type} results</span>
        </h3>
      </section>
    </section>
  );
};

export default CheckTypeIncompleteResults;
