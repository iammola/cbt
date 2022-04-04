import Link from "next/link";
import Head from "next/head";
import type { NextPage } from "next";
import { ExternalLinkIcon } from "@heroicons/react/solid";

import { Sidebar } from "components/Layout";

const CheckIncompleteResults: NextPage = () => {
  return (
    <section className="flex h-screen w-screen items-center justify-start divide-y-[1.5px] divide-gray-200">
      <Sidebar />
      <Head>
        <title>Check Results Status | CBT | Grand Regal School</title>
        <meta
          name="description"
          content="Results Status | GRS CBT"
        />
      </Head>
      <section className="flex h-screen w-screen grow flex-col items-center justify-center gap-7">
        <h3 className="text-center text-5xl font-bold tracking-wider text-gray-600">
          <span className="block">Check results status</span>
        </h3>
        <div className="flex w-full items-center justify-center gap-x-6">
          <Link href="/results/check-status/all">
            <a
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-w-max items-center justify-center gap-x-2 rounded-full bg-slate-500 px-10 py-3 text-xs font-bold uppercase tracking-widest text-white shadow hover:bg-slate-600"
            >
              Check all
              <ExternalLinkIcon className="h-5 w-5 fill-white" />
            </a>
          </Link>
          <Link href="/results/check-status/class">
            <a
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-w-max items-center justify-center gap-x-2 rounded-full bg-slate-500 px-10 py-3 text-xs font-bold uppercase tracking-widest text-white shadow hover:bg-slate-600"
            >
              Check a class
              <ExternalLinkIcon className="h-5 w-5 fill-white" />
            </a>
          </Link>
          <Link href="/results/check-status/student">
            <a
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-w-max items-center justify-center gap-x-2 rounded-full bg-slate-500 px-10 py-3 text-xs font-bold uppercase tracking-widest text-white shadow hover:bg-slate-600"
            >
              Check a student
              <ExternalLinkIcon className="h-5 w-5 fill-white" />
            </a>
          </Link>
        </div>
      </section>
    </section>
  );
};

export default CheckIncompleteResults;
