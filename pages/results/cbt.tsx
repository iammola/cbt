import useSWR from "swr";
import Head from "next/head";
import type { NextPage } from "next";
import { useCookies } from "react-cookie";
import { formatRelative } from "date-fns";
import { useEffect, useState } from "react";

import Select from "components/Select";
import { UserImage } from "components/Misc";
import { Navbar, Sidebar } from "components/Layout";

import type { SelectOption, RouteData, ClientResponse } from "types";
import type { ClassesGETData, TeacherCBTResultsGETData, ClassExamGETData } from "types/api";

const Results: NextPage = () => {
  const [{ account }] = useCookies(["account"]);
  const [exams, setExams] = useState<SelectOption[]>();
  const { data: classes, error } = useSWR<RouteData<ClassesGETData>>(
    account !== undefined ? `/api/teachers/${account._id}/classes` : null,
    (url) => fetch(url ?? "").then((res) => res.json())
  );

  const [results, setResults] = useState<TeacherCBTResultsGETData>();
  const [selectedExam, setSelectedExam] = useState({
    _id: "",
    name: "Select exam",
  });
  const [selectedClass, setSelectedClass] = useState({
    _id: "",
    name: "Loading classes...",
  });

  useEffect(() => {
    setSelectedClass({
      _id: "",
      name:
        error !== undefined && classes === undefined
          ? "Error Loading Classes"
          : classes === undefined
          ? "Loading classes..."
          : "Select class",
    });
  }, [classes, error]);

  useEffect(() => {
    const { _id } = selectedClass;

    async function getExams() {
      setExams([]);
      setSelectedExam({ _id: "", name: "Loading exams..." });

      try {
        const res = await fetch(`/api/classes/${_id}/exams`);
        const result = (await res.json()) as ClientResponse<ClassExamGETData>;

        if (result.success) {
          setExams(result.data.exams);
          setSelectedExam({ _id: "", name: "Select exam" });
        } else throw new Error(result.error);
      } catch (error: any) {
        console.log({ error });
      }
    }

    if (_id !== "") getExams();
  }, [selectedClass]);

  async function getData() {
    if (selectedExam._id !== "") {
      try {
        const res = await fetch(`/api/teachers/${account._id}/cbt_results/${selectedExam._id}`);
        const result = (await res.json()) as ClientResponse<TeacherCBTResultsGETData>;

        if (result.success) {
          setResults(result.data);
        } else throw new Error(result.error);
      } catch (error: any) {
        console.log({ error });
      }
    }
  }

  return (
    <>
      <Head>
        <title>Results | CBT | Grand Regal School</title>
        <meta
          name="description"
          content="Written Results | GRS CBT"
        />
      </Head>
      <section className="flex h-screen w-screen items-center justify-start divide-y-[1.5px] divide-gray-200">
        <Sidebar />
        <main className="flex h-full grow flex-col items-center justify-center divide-x-[1.5px] divide-gray-200">
          <Navbar />
          <section className="flex w-full grow flex-col items-center justify-start gap-3 overflow-y-auto bg-gray-50/80 py-10 px-6">
            <div className="flex w-full items-end justify-center gap-4">
              <Select
                label="Class"
                options={classes?.data}
                selected={selectedClass}
                colorPallette={{
                  activeCheckIconColor: "stroke-indigo-600",
                  inactiveCheckIconColor: "stroke-indigo-800",
                  activeOptionColor: "text-indigo-900 bg-indigo-100",
                  buttonBorderColor: "focus-visible:border-indigo-500",
                  buttonOffsetFocusColor: "focus-visible:ring-offset-indigo-500",
                }}
                handleChange={setSelectedClass}
              />
              <Select
                label="Exam"
                options={exams}
                selected={selectedExam}
                colorPallette={{
                  activeCheckIconColor: "stroke-indigo-600",
                  inactiveCheckIconColor: "stroke-indigo-800",
                  activeOptionColor: "text-indigo-900 bg-indigo-100",
                  buttonBorderColor: "focus-visible:border-indigo-500",
                  buttonOffsetFocusColor: "focus-visible:ring-offset-indigo-500",
                }}
                handleChange={setSelectedExam}
              />
              <button
                onClick={getData}
                className="mb-3 min-w-max rounded-md bg-gray-500 px-4 py-3 text-xs text-white shadow-md hover:bg-gray-600"
              >
                Load Results
              </button>
            </div>
            {results !== undefined && (
              <table className="min-w-full overflow-hidden rounded-lg shadow-md">
                <thead className="bg-gray-200 text-gray-700">
                  <tr>
                    {["Student", "Score", "Date"].map((i) => (
                      <th
                        key={i}
                        scope="col"
                        className="py-5"
                      >
                        <span className="flex items-center justify-start pl-6 pr-3 text-xs font-medium uppercase tracking-wider text-gray-500">
                          {i}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white text-gray-600">
                  {results.map(({ student, results }) => (
                    <tr
                      key={student._id.toString()}
                      className="text-sm font-medium"
                    >
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="relative h-10 w-10 shrink-0">
                            <UserImage
                              src=""
                              layout="fill"
                              objectFit="cover"
                              objectPosition="center"
                              className="rounded-full"
                              initials={{
                                text: student.name.initials,
                                className: "rounded-full bg-indigo-300",
                              }}
                            />
                          </div>
                          <span>{student.name.full}</span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">{results[0].score}</td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {(() => {
                          const date = formatRelative(new Date(results[0].started), new Date());
                          return date[0].toUpperCase() + date.slice(1);
                        })()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        </main>
      </section>
    </>
  );
};

export default Results;
