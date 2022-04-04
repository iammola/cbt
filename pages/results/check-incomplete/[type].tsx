import useSWR from "swr";
import Head from "next/head";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import Select from "components/Select";
import { Sidebar } from "components/Layout";

import type { ClientResponse, RouteData, SelectOption } from "types";
import type { AllTermsGetData, ClassesGETData, StudentsGETData } from "types/api";

const CheckTypeIncompleteResults: NextPage = () => {
  const router = useRouter();

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
          {router.query.type === "student" && (
            <Select
              selected={selectedStudent}
              handleChange={setSelectedStudent}
              options={students}
            />
          )}
          {router.query.type === "classes" && (
            <Select
              selected={selectedClass}
              handleChange={setSelectedClass}
              options={classes?.data}
            />
          )}
        </div>
      </section>
    </section>
  );
};

export default CheckTypeIncompleteResults;
