import useSWR from "swr";
import { useState } from "react";
import { useRouter } from "next/router";
import { format } from "date-fns";

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

      if (result.success) mutate();
      else throw new Error(result.error);
    } catch (error) {
      alert("Error Updating Data");
      console.log({ error });
    }
  }

  return (
    <section className="flex h-screen w-screen items-center justify-start divide-y-[1.5px] divide-gray-200">
      <Sidebar />
      <main className="flex h-full grow flex-col items-center justify-center divide-x-[1.5px] divide-gray-200">
        <Navbar />
        {data != undefined && (
          <section className="w-full grow space-y-5 overflow-y-auto bg-gray-50 py-7 px-6">
            <div className="w-full">
              <h2 className="md:text-xl lg:text-3xl">{data.name.full}</h2>
              <p className="flex w-full items-center justify-start gap-x-4 text-sm text-gray-600">
                <a href={`mailto:${data.email}`}>
                  <a className="text-inherit">{data.email}</a>
                </a>
                &middot;
                <span>Born on {format(new Date(data.birthday), "do 'of' MMMM yyyy")}</span>
                &middot;
                <span>{data.gender === "F" ? "Female" : "Male"}</span>
              </p>
            </div>
            <h3>Edit {data.name.first}&apos;s Basic Details</h3>
            <EditData
              {...data}
              onSubmit={updateStudent}
            />
            <h3>Edit {data.name.first}&apos;s Academic Details</h3>
            {!editAcademic ? (
              <button
                type="button"
                onClick={() => setEditAcademic(true)}
              >
                Load
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
