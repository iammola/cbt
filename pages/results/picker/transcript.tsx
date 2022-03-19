import useSWR from "swr";
import Head from "next/head";
import Link from "next/link";
import type { NextPage } from "next";
import { useEffect, useMemo, useState } from "react";
import { ExternalLinkIcon } from "@heroicons/react/solid";

import Select from "components/Select";
import { classNames, sort } from "utils";
import { Sidebar } from "components/Layout";

import type { RouteData } from "types";
import type { StudentsGETData } from "types/api/students";

const TranscriptPicker: NextPage = () => {
  const [selectedStudent, setSelectedStudent] = useState({
    _id: "",
    name: "Loading students...",
  });

  const { data: students } = useSWR<RouteData<StudentsGETData>>(`/api/students/?select=name.full`, (url) =>
    fetch(url ?? "").then((res) => res.json())
  );

  const studentOptions = useMemo(
    () => sort(students?.data?.map((item) => ({ ...item, name: `${item.name.full}` })) ?? []),
    [students]
  );

  useEffect(() => {
    if (students && !selectedStudent._id)
      setSelectedStudent({
        _id: "",
        name: "Select student",
      });
  }, [selectedStudent._id, students]);

  return (
    <section className="flex h-screen w-screen items-center justify-start divide-y-[1.5px] divide-gray-200">
      <Sidebar />
      <Head>
        <title>Transcript Picker | Portal | Grand Regal School</title>
        <meta
          name="description"
          content="Transcript | GRS Portal"
        />
      </Head>
      <section className="flex h-screen w-screen flex-col items-center justify-center gap-7">
        <h3 className="text-center text-5xl font-bold tracking-wider text-gray-600">
          <span className="block">Select student</span>
        </h3>
        <div className="flex flex-col items-center justify-center gap-10 pt-8">
          <div className="flex items-center justify-center gap-x-10">
            <Select
              selected={selectedStudent}
              handleChange={setSelectedStudent}
              options={studentOptions}
            />
          </div>
          <Link href={`/results/${`${selectedStudent._id}/`}transcript`}>
            <a
              target="_blank"
              rel="noopener noreferrer"
              className={classNames(
                "flex min-w-max items-center justify-center gap-x-2 rounded-full bg-slate-500 px-10 py-3 text-xs font-bold uppercase tracking-widest text-white shadow hover:bg-slate-600",
                { "pointer-events-none": !selectedStudent._id }
              )}
            >
              Load Transcript
              <ExternalLinkIcon className="h-5 w-5 fill-white" />
            </a>
          </Link>
        </div>
      </section>
    </section>
  );
};

export default TranscriptPicker;
