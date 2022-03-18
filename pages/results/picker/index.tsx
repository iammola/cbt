import useSWR from "swr";
import Head from "next/head";
import Link from "next/link";
import type { NextPage } from "next";
import { useEffect, useMemo, useState } from "react";

import { classNames } from "utils";
import Select from "components/Select";

import type { ClientResponse, RouteData } from "types";
import type { AllTermsGetData } from "types/api/sessions";
import type { ClassesGETData, ClassStudentsGETData } from "types/api/classes";

const ResultsPicker: NextPage = () => {
  const [selectedStudent, setSelectedStudent] = useState({
    _id: "",
    name: "Select term",
  });
  const [selectedTerm, setSelectedTerm] = useState({
    _id: "",
    name: "Loading terms...",
  });

  const [students, setStudents] = useState<{ class: any; students: ClassStudentsGETData }[]>([]);

  const { data: classes } = useSWR<RouteData<ClassesGETData>>(`/api/classes/?select=name alias`, (url) =>
    fetch(url ?? "").then((res) => res.json())
  );
  const { data: terms } = useSWR<RouteData<AllTermsGetData>>("/api/terms/all", (url) =>
    fetch(url).then((res) => res.json())
  );

  const studentOptions = useMemo(
    () =>
      students
        .map((item) =>
          item.students.map((student) => ({
            ...student,
            name: `${student.name.full} - ${classes?.data.find((i) => i._id === item.class)?.alias}`,
          }))
        )
        .flat()
        .sort((a, b) => {
          const nameA = a.name.toUpperCase();
          const nameB = b.name.toUpperCase();
          return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
        }),
    [classes?.data, students]
  );

  useEffect(() => {
    async function getStudents(classes: ClassesGETData) {
      setSelectedStudent({
        _id: "",
        name: "Loading students...",
      });
      await Promise.all(
        classes.map(async ({ _id }) => {
          const res = await fetch(`/api/classes/${_id}/students/?term=${selectedTerm._id}`);
          const result = (await res.json()) as ClientResponse<ClassStudentsGETData>;

          if (result.success)
            setStudents((students) => [
              ...students.filter((j) => j.class !== _id),
              {
                class: _id,
                students: result.data,
              },
            ]);
          setSelectedStudent({
            _id: "",
            name: "Select student",
          });
        })
      );
      console.log("Loaded Students");
    }

    if (classes?.data && selectedTerm._id) getStudents(classes.data);
  }, [classes, selectedTerm]);

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

  return (
    <section className="flex h-screen w-screen flex-col items-center justify-center gap-7">
      <Head>
        <title>Results Picker | Portal | Grand Regal School</title>
        <meta
          name="description"
          content="Results | GRS Portal"
        />
      </Head>
      <h3 className="text-center text-5xl font-bold tracking-wider text-gray-600">
        <span className="block">Select term</span> <span className="block">and student</span>
      </h3>
      <div className="flex flex-col items-center justify-center gap-10 pt-8">
        <div className="flex items-center justify-center gap-x-10">
          <Select
            options={terms?.data}
            selected={selectedTerm}
            handleChange={setSelectedTerm}
          />
          <Select
            selected={selectedStudent}
            handleChange={setSelectedStudent}
            options={studentOptions}
          />
        </div>
        <Link href={`/results/${selectedStudent._id}${"current" in selectedTerm ? "" : `?term=${selectedTerm._id}`}`}>
          <a
            target="_blank"
            rel="noopener noreferrer"
            className={classNames(
              "min-w-max rounded-full bg-slate-500 px-10 py-3 text-xs font-bold uppercase tracking-widest text-white shadow hover:bg-slate-600",
              {
                "pointer-events-none": !selectedStudent._id && !selectedTerm._id,
              }
            )}
          >
            Go to Result
          </a>
        </Link>
      </div>
    </section>
  );
};

export default ResultsPicker;
