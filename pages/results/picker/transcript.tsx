import useSWR from "swr";
import Head from "next/head";
import Link from "next/link";
import type { NextPage } from "next";
import { useMemo, useState } from "react";

import { classNames } from "utils";
import Select from "components/Select";

import type { RouteData } from "types";
import type { StudentsGETData } from "types/api/students";

const TranscriptPicker: NextPage = () => {
  const [selectedStudent, setSelectedStudent] = useState({
    _id: "",
    name: "Select student",
  });

  const { data: students } = useSWR<RouteData<StudentsGETData>>(`/api/students/?select=name.full`, (url) =>
    fetch(url ?? "").then((res) => res.json())
  );

  const studentOptions = useMemo(
    () =>
      students?.data
        ?.map((item) => ({ ...item, name: `${item.name.full}` }))
        .sort((a, b) => {
          const nameA = a.name.toUpperCase();
          const nameB = b.name.toUpperCase();
          return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
        }),
    [students]
  );

  return (
    <section className="flex h-screen w-screen flex-col items-center justify-center gap-7">
      <Head>
        <title>Transcript Picker | Portal | Grand Regal School</title>
        <meta
          name="description"
          content="Transcript | GRS Portal"
        />
      </Head>
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
              "min-w-max rounded-full bg-slate-500 px-10 py-3 text-xs font-bold uppercase tracking-widest text-white shadow hover:bg-slate-600",
              { "pointer-events-none": !selectedStudent._id }
            )}
          >
            Go to Transcript
          </a>
        </Link>
      </div>
    </section>
  );
};

export default TranscriptPicker;
