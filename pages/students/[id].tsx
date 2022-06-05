import useSWR from "swr";
import Head from "next/head";
import { useState } from "react";
import { format } from "date-fns";
import { useRouter } from "next/router";

import { Divide } from "components/Misc";
import { Sidebar, Navbar } from "components/Layout";
import { EditData, EditAcademicData } from "components/Student";

import type { NextPage } from "next";
import type { RouteData } from "types";
import type { StudentGETData } from "types/api";

const Student: NextPage = () => {
  const router = useRouter();
  const [editAcademic, setEditAcademic] = useState(false);
  const { data: { data } = {}, mutate } = useSWR<RouteData<StudentGETData>>(
    router.isReady && `/api/students/${router.query.id}?select=-academic`
  );

  async function updateStudent(update: Omit<NonNullable<StudentGETData>, "_id" | "academic">) {
    if (data == undefined) return;

    function isEqual<T extends unknown>(test: T, compare: T): boolean {
      if (["number", "string"].includes(typeof test)) return compare === test;

      if (test instanceof Date) return test.getTime() === (compare as Date).getTime();

      if (test instanceof Object)
        return Object.entries(test).every(([key, val]) => isEqual(val, (compare as Record<string, string>)[key]));

      return false;
    }

    const body = Object.entries(update).reduce(
      (acc, [key, value]) => Object.assign(acc, !isEqual(data[key as keyof typeof data], value) && { [key]: value }),
      {} as typeof data
    );

    try {
      const res = await fetch(`/api/students/${router.query.id}/`, {
        method: "PUT",
        body: JSON.stringify(body),
      });
      const result = await res.json();

      if (result.success) {
        mutate();
        alert("Success");
      } else throw new Error(result.error);
    } catch (error) {
      alert("Error Updating Data");
      console.error({ error });
    }
  }

  return (
    <section className="flex h-screen w-screen items-center justify-start divide-y-[1.5px] divide-gray-200">
      <Sidebar />
      <Head>
        <title>{data?.name.full}&apos; Profile | GRS CBT</title>
      </Head>
      <main className="flex h-full grow flex-col items-start justify-start divide-x-[1.5px] divide-gray-200">
        <Navbar />
        {data != undefined && (
          <section className="w-full grow space-y-5 overflow-y-auto bg-gray-50 py-7 px-6">
            <div className="w-full">
              <h2 className="text-center font-bold tracking-wider text-slate-700 md:text-xl lg:text-3xl">
                {data.name.full}
              </h2>
              <p className="w-full text-center text-sm text-gray-600">
                <a href={`mailto:${data.email}`}>
                  <a className="text-inherit">{data.email}</a>
                </a>{" "}
                &middot; <span>Born on {format(new Date(data.birthday), "do 'of' MMMM yyyy")}</span> &middot;{" "}
                <span>{data.gender === "F" ? "Female" : "Male"}</span>
              </p>
            </div>
            <Divide className="mb-3 w-[85%] py-2" />
            <EditData
              {...data}
              onSubmit={updateStudent}
            />
            <Divide className="mt-3 mb-3 w-[85%] py-2" />
            {!editAcademic ? (
              <button
                type="button"
                onClick={() => setEditAcademic(true)}
                className="rounded-md bg-gray-600 px-3 py-2 text-sm tracking-wide text-white"
              >
                Load Academic Data
              </button>
            ) : (
              <EditAcademicData id={data._id.toString()} />
            )}
          </section>
        )}
      </main>
    </section>
  );
};

export default Student;
