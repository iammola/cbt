import useSWR from "swr";
import Head from "next/head";
import type { NextPage } from "next";
import { useEffect, useMemo, useState } from "react";

import Select from "components/Select";

import type { ClientResponse, RouteData } from "types";
import type { ClassesGETData, ClassStudentsGETData } from "types/api/classes";

const ResultsPicker: NextPage = () => {
  const [advanced, setAdvanced] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState({
    _id: "",
    name: "Select student",
  });
  const [students, setStudents] = useState<
    { class: any; students: ClassStudentsGETData }[]
  >([]);
  const { data: classes } = useSWR<RouteData<ClassesGETData>>(
    `/api/classes/?select=name alias`,
    (url) => fetch(url ?? "").then((res) => res.json())
  );

  const studentOptions = useMemo(
    () =>
      students
        .map((item) =>
          item.students.map((student) => ({
            ...student,
            name: `${student.name.full} - ${
              classes?.data.find((i) => i._id === item.class)?.alias
            }`,
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

  const loadItems = (id: any) =>
    students
      .find((item) => item.class === id)
      ?.students.map((student) => openTab(student._id));
  const openTab = (id: any) =>
    Object.assign(document.createElement("a"), {
      target: "_blank",
      href: `/results/${id}`,
      rel: "noopener, noreferrer",
    }).click();

  useEffect(() => {
    async function getStudents(classes: ClassesGETData) {
      await Promise.all(
        classes.map(async ({ _id }) => {
          const res = await fetch(`/api/classes/${_id}/students/`);
          const result =
            (await res.json()) as ClientResponse<ClassStudentsGETData>;

          if (result.success === true)
            setStudents((students) => [
              ...students.filter((j) => j.class !== _id),
              {
                class: _id,
                students: result.data,
              },
            ]);
        })
      );
      console.log("Loaded Students");
    }

    if (classes !== undefined) getStudents(classes.data);
  }, [classes]);

  return (
    <section className="flex h-screen w-screen flex-col items-center justify-center gap-7">
      <Head>
        <title>Results Picker | Portal | Grand Regal School</title>
        <meta name="description" content="Results | GRS Portal" />
      </Head>
      {advanced === true && (
        <>
          <h3 className="text-5xl font-bold tracking-wide text-gray-800">
            Load results for all students in a class
          </h3>
          <div className="flex w-full flex-wrap items-center justify-center gap-4 px-10">
            {classes?.data.map((item) => {
              const data =
                students.find((element) => element.class === item._id)
                  ?.students ?? [];

              return (
                data?.length > 0 && (
                  <div
                    key={item.name}
                    onClick={() => loadItems(item._id)}
                    className="flex h-16 cursor-pointer select-none items-center justify-center gap-6 rounded-full px-4 py-3 shadow"
                  >
                    <span className="text-sm font-medium text-gray-700">
                      {item.name}
                    </span>
                    <span className="text-xs text-gray-400">
                      {data.length} student{data.length > 1 && "s"}
                    </span>
                  </div>
                )
              );
            })}
          </div>
          <span className="font-medium tracking-widest text-gray-600">or</span>
        </>
      )}
      <h3 className="text-5xl font-bold tracking-wider text-gray-600">
        Select student
      </h3>
      <div className="flex flex-col items-center justify-center gap-10 pt-8">
        <Select
          selected={selectedStudent}
          handleChange={setSelectedStudent}
          options={studentOptions}
        />
        <button
          type="button"
          onClick={() => {
            const { _id } = selectedStudent;
            _id !== "" && openTab(_id);
          }}
          className="min-w-max rounded-full bg-slate-500 px-10 py-3 text-xs font-bold uppercase tracking-widest text-white shadow hover:bg-slate-600"
        >
          Go to Result
        </button>
      </div>
    </section>
  );
};

export default ResultsPicker;
