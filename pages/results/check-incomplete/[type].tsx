import useSWR from "swr";
import Head from "next/head";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import Select from "components/Select";
import { Sidebar } from "components/Layout";

import type { RouteData } from "types";
import type { AllTermsGetData } from "types/api";

const CheckTypeIncompleteResults: NextPage = () => {
  const router = useRouter();

  const { data: terms } = useSWR<RouteData<AllTermsGetData>>("/api/terms/all");

  const [selectedTerm, setSelectedTerm] = useState({
    _id: "",
    name: "Loading terms...",
  });

  useEffect(() => {
    if (!selectedTerm._id && terms?.data !== undefined) {
      const term = terms.data.find((i) => i.current) as unknown as typeof selectedTerm;

      setSelectedTerm(
        term ?? {
          _id: "",
          name: "Select term",
        }
      );
    }
  }, [selectedTerm, terms]);

  useEffect(() => {
    if (!router.isReady) return;
    if (!["all", "class", "student"].includes(router.query.type as string))
      router.replace({
        pathname: router.pathname,
        query: { ...router.query, type: "all" },
      });
  }, [router]);

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
        <div className="flex items-center justify-center gap-x-10">
          <Select
            label="Term"
            options={terms?.data}
            selected={selectedTerm}
            handleChange={setSelectedTerm}
          />
        </div>
      </section>
    </section>
  );
};

export default CheckTypeIncompleteResults;
