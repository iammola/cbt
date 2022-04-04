import useSWR from "swr";
import Head from "next/head";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ChevronRightIcon } from "@heroicons/react/solid";

import { capitalize } from "utils";
import Select from "components/Select";
import { Divide } from "components/Misc";
import { Sidebar } from "components/Layout";

import type { ClientResponse, RouteData, SelectOption } from "types";
import type { AllTermsGetData, ClassesGETData, StudentsGETData, StudentResultStatusData } from "types/api";

const CheckTypeIncompleteResults: NextPage = () => {
  const router = useRouter();
  const [data, setData] = useState<StudentResultStatusData[]>([]);

  const { data: terms } = useSWR<RouteData<AllTermsGetData>>("/api/terms/all");
  const { data: classes } = useSWR<RouteData<ClassesGETData>>(
    router.query.type === "class" && `/api/classes/?select=name`
  );

  const [students, setStudents] = useState<SelectOption[]>();
  const [selectedTerm, setSelectedTerm] = useState({
    _id: "",
    name: "Loading terms...",
  });
  const [selectedClass, setSelectedClass] = useState({
    _id: "",
    name: "Select class",
  });
  const [selectedStudent, setSelectedStudent] = useState({
    _id: "",
    name: "Select term",
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
    async function getStudents() {
      setSelectedStudent({
        _id: "",
        name: "Loading students...",
      });
      const res = await fetch(`/api/students?select=name.full&term=${selectedTerm._id}`);
      const data = (await res.json()) as ClientResponse<StudentsGETData>;

      if (data.success) setStudents(data.data.map((s) => ({ _id: s._id, name: s.name.full })).sort());
      else console.error(data.error);
    }

    if (selectedTerm._id) getStudents();
  }, [selectedTerm]);

  useEffect(() => {
    if (!router.isReady) return;
    if (!["all", "class", "student"].includes(router.query.type as string))
      router.replace({
        pathname: router.pathname,
        query: { ...router.query, type: "all" },
      });
  }, [router]);

  async function checkType(url: string) {
    const res = await fetch(url);
    const data = (await res.json()) as ClientResponse<StudentResultStatusData | StudentResultStatusData[]>;

    if (data.success) setData([data.data].flat());
  }

  async function checkData() {
    if (!selectedTerm._id) return;

    if (router.query.type === "all") checkType(`api/students/results/status?term=${selectedTerm._id}`);
    if (router.query.type === "class" && selectedClass._id)
      checkType(`api/classes/${selectedClass._id}/results/status?term=${selectedTerm._id}`);
    if (router.query.type === "student" && selectedStudent._id)
      checkType(`/api/students/${selectedStudent._id}/results/status?term=${selectedTerm._id}`);
  }

  return (
    <section className="flex h-screen w-screen items-center justify-start divide-y-[1.5px] divide-gray-200">
      <Sidebar />
      <Head>
        <title>Check {capitalize(router.query.type as string)} Incomplete Results | CBT | Grand Regal School</title>
        <meta
          name="description"
          content={`${capitalize(router.query.type as string)} Incomplete Results | GRS CBT`}
        />
      </Head>
      <section className="flex h-screen w-screen grow flex-col items-center justify-start gap-7 pt-8 pb-4">
        <h3 className="text-center text-5xl font-bold tracking-wider text-gray-600">
          <span className="block">Check {capitalize(router.query.type as string)} Results</span>
        </h3>
        <div className="flex items-center justify-center gap-x-10">
          <Select
            label="Term"
            options={terms?.data}
            selected={selectedTerm}
            handleChange={setSelectedTerm}
          />
          {router.query.type === "student" && (
            <Select
              label="Student"
              selected={selectedStudent}
              handleChange={setSelectedStudent}
              options={students}
            />
          )}
          {router.query.type === "class" && (
            <Select
              label="Class"
              selected={selectedClass}
              handleChange={setSelectedClass}
              options={classes?.data}
            />
          )}
        </div>
        <div className="flex items-start justify-center px-6">
          <button
            onClick={checkData}
            className="mx-auto my-4 min-w-max rounded-md bg-gray-500 px-4 py-3 text-xs text-white shadow-md hover:bg-gray-600"
          >
            Start Check
          </button>
        </div>
        <Divide
          className="w-full px-20"
          HRclassName="border-t-gray-300"
        />
        <div className="grid w-full grid-flow-row grid-cols-1 gap-x-6 gap-y-4 px-5 lg:grid-cols-2">
          {data.map((d) => (
            <details
              key={String(d._id)}
              className="group w-full min-w-0"
            >
              <summary className="flex w-full cursor-pointer items-center justify-start gap-x-2 truncate rounded-md py-2.5 px-3 ring-1 ring-transparent ring-slate-300 group-open:ring-2">
                <ChevronRightIcon className="h-5 w-5 fill-slate-600" />
                <span className="tracking-wide text-slate-700">{d.name}</span>
                &middot;
                <span className="text-xs text-slate-500">{d.class}</span>
                &middot;
                <span className="text-xs text-slate-500">{d.report.filter((r) => !r.state).length} error(s)</span>
              </summary>
              <ul className="w-full">
                {d.report.map((r) => (
                  <li
                    key={r.message}
                    className="flex w-full items-center justify-start gap-x-3 p-2"
                  >
                    <span>{r.state ? "👌" : "❗️"}</span>
                    <span className="text-sm text-gray-600">{r.message}</span>
                  </li>
                ))}
              </ul>
            </details>
          ))}
        </div>
      </section>
    </section>
  );
};

export default CheckTypeIncompleteResults;
