import useSWR from "swr";
import Head from "next/head";
import type { NextPage } from "next";
import { useState, useEffect, FormEvent } from "react";

import Select from "components/Select";
import { Sidebar, Navbar } from "components/Layout";

import type { ClientResponse, RouteData, StudentRecord } from "types";
import type { ClassStudentsGETData, StudentCommentGETData, ClassesGETData, StudentCommentPOSTData } from "types/api";

const Comments: NextPage = () => {
  const [students, setStudents] = useState<ClassStudentsGETData>([]);

  const [loadedStudent, setLoadedStudent] = useState("");
  const [comment, setComment] = useState<NonNullable<StudentCommentGETData>["comments"]>();

  const [selectedStudent, setSelectedStudent] = useState({
    _id: "",
    name: "Select student",
  });
  const [selectedClass, setSelectedClass] = useState({
    _id: "",
    name: "Loading classes...",
  });
  const { data: classes, error } = useSWR<RouteData<ClassesGETData>>("/api/classes?select=name", (url) =>
    fetch(url).then((res) => res.json())
  );

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

  async function getStudents(selectedClass: any) {
    setStudents([]);
    setSelectedClass(selectedClass);

    if (selectedClass._id !== "") {
      setSelectedStudent({ _id: "", name: "Loading students..." });
      try {
        const res = await fetch(`/api/classes/${selectedClass._id}/students`);
        const result = (await res.json()) as ClientResponse<ClassStudentsGETData>;

        if (result.success) {
          setStudents(result.data);
          setSelectedStudent({ _id: "", name: "Select student" });
        } else throw new Error(result.error);
      } catch (error: any) {
        setSelectedStudent({ _id: "", name: "Error Loading students" });
        console.error({ error });
      }
    }
  }

  async function getComments() {
    if (selectedStudent._id !== "") {
      setComment(undefined);

      try {
        const res = await fetch(`/api/students/${selectedStudent._id}/comments`);
        const result = (await res.json()) as ClientResponse<StudentCommentGETData>;

        if (result.success) {
          setLoadedStudent(selectedStudent.name);
          setComment(result.data?.comments ?? "");
        } else throw new Error(result.error);
      } catch (error: any) {
        console.error({ error });
      }
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      const res = await fetch(`/api/students/${selectedStudent._id}/comments`, {
        method: "POST",
        body: JSON.stringify({ comment }),
      });
      const result = (await res.json()) as ClientResponse<StudentCommentPOSTData>;

      if (result.success) alert("Done");
      else throw new Error(result.error);
    } catch (error: any) {
      console.error({ error });
    }
  }

  return (
    <>
      <Head>
        <title>Comments | CBT | Grand Regal School</title>
        <meta
          name="description"
          content="Comments | GRS CBT"
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
                handleChange={getStudents}
              />
              <Select
                label="Student"
                options={students.map(({ _id, name: { full } }) => ({
                  _id,
                  name: full,
                }))}
                selected={selectedStudent}
                colorPallette={{
                  activeCheckIconColor: "stroke-indigo-600",
                  inactiveCheckIconColor: "stroke-indigo-800",
                  activeOptionColor: "text-indigo-900 bg-indigo-100",
                  buttonBorderColor: "focus-visible:border-indigo-500",
                  buttonOffsetFocusColor: "focus-visible:ring-offset-indigo-500",
                }}
                handleChange={setSelectedStudent}
              />
              <button
                onClick={getComments}
                className="mb-3 min-w-max rounded-md bg-gray-500 px-4 py-3 text-xs text-white shadow-md hover:bg-gray-600"
              >
                Load Comments
              </button>
            </div>
            {comment !== undefined && loadedStudent !== "" && (
              <form
                onSubmit={handleSubmit}
                className="flex w-full grow flex-col items-center justify-start gap-7 py-10 px-3"
              >
                <h4 className="text-2xl font-extrabold uppercase tracking-wider text-gray-800">{loadedStudent}</h4>
                <div className="flex w-full flex-col items-start justify-center gap-3">
                  <h5 className="font-medium tracking-wide text-gray-700">Comment</h5>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full rounded-lg border-2 border-gray-600 p-3"
                  />
                </div>
                <button
                  type="submit"
                  className="rounded-md bg-gray-500 px-12 py-2 text-white shadow-md hover:bg-gray-600"
                >
                  Save
                </button>
              </form>
            )}
          </section>
        </main>
      </section>
    </>
  );
};

export default Comments;
