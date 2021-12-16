import useSWR from "swr";
import Head from "next/head";
import type { NextPage } from "next";
import { useState, useEffect } from "react";

import Select from "components/Select";
import { Sidebar, Navbar } from "components/Layout";

import type { StudentCommentGETData } from "types/api/students";
import type { ClientResponse, RouteData, StudentRecord } from "types";
import type { ClassesGETData, ClassStudentsGETData } from "types/api/classes";

const Comments: NextPage = () => {
    const [students, setStudents] = useState<ClassStudentsGETData>([]);
    const [comment, setComment] = useState<NonNullable<StudentCommentGETData>['comments']>();
    const [selectedStudent, setSelectedStudent] = useState({ _id: "", name: "Select student" });
    const [selectedClass, setSelectedClass] = useState({ _id: "", name: "Loading classes..." });
    const { data: classes, error } = useSWR<RouteData<ClassesGETData>>("/api/classes?select=name", url => fetch(url).then(res => res.json()));

    useEffect(() => {
        setSelectedClass({
            _id: "",
            name: (error !== undefined && classes === undefined) ? "Error Loading Classes" : (classes === undefined ? "Loading classes..." : "Select class")
        });
    }, [classes, error]);

    async function getStudents(selectedClass: any) {
        setSelectedClass(selectedClass);

        if (selectedClass._id !== "") {
            try {
                const res = await fetch(`/api/classes/${selectedClass._id}/students`);
                const result = await res.json() as ClientResponse<ClassStudentsGETData>;

                if (result.success === true) setStudents(result.data);
                else throw new Error(result.error);
            } catch (error: any) {
                console.error({ error });
            }
        }
    }

    async function getComments() {
        if (selectedStudent._id !== "") {
            try {
                const res = await fetch(`/api/students/${selectedStudent._id}/comments`);
                const result = await res.json() as ClientResponse<StudentCommentGETData>;

                if (result.success === true) setComment(result.data?.comments);
                else throw new Error(result.error);
            } catch (error: any) {
                console.error({ error });
            }
        }
    }

    return (
        <>
            <Head>
                <title>Comments | CBT | Grand Regal School</title>
                <meta name="description" content="Comments | GRS CBT" />
            </Head>
            <section className="flex items-center justify-start w-screen h-screen divide-y-[1.5px] divide-gray-200">
                <Sidebar />
                <main className="flex flex-col grow items-center justify-center divide-x-[1.5px] divide-gray-200 h-full">
                    <Navbar />
                    <section className="flex flex-col gap-3 items-center justify-start w-full py-10 px-6 grow bg-gray-50/80 overflow-y-auto">
                        <div className="flex gap-4 items-end justify-center w-full">
                            <Select
                                label="Class"
                                options={classes?.data}
                                selected={selectedClass}
                                colorPallette={{
                                    activeCheckIconColor: "stroke-indigo-600",
                                    inactiveCheckIconColor: "stroke-indigo-800",
                                    activeOptionColor: "text-indigo-900 bg-indigo-100",
                                    buttonBorderColor: "focus-visible:border-indigo-500",
                                    buttonOffsetFocusColor: "focus-visible:ring-offset-indigo-500"
                                }}
                                handleChange={getStudents}
                            />
                            <Select
                                label="Student"
                                options={students.map(({ _id, name: { full } }) => ({ _id, name: full }))}
                                selected={selectedStudent}
                                colorPallette={{
                                    activeCheckIconColor: "stroke-indigo-600",
                                    inactiveCheckIconColor: "stroke-indigo-800",
                                    activeOptionColor: "text-indigo-900 bg-indigo-100",
                                    buttonBorderColor: "focus-visible:border-indigo-500",
                                    buttonOffsetFocusColor: "focus-visible:ring-offset-indigo-500"
                                }}
                                handleChange={setSelectedStudent}
                            />
                            <button
                                onClick={getComments}
                                className="px-4 py-3 rounded-md shadow-md bg-gray-500 hover:bg-gray-600 text-white text-xs mb-3 min-w-max"
                            >
                                Load Comments
                            </button>
                        </div>
                        {comment !== undefined && (
                            <form className="flex flex-col gap-7 items-center justify-start w-full py-10 px-3 grow">
                                <h4 className="text-2xl font-extrabold uppercase tracking-wider text-gray-800">
                                    {selectedStudent.name}
                                </h4>
                                <div className="flex flex-col gap-3 items-start justify-center w-full">
                                    <h5 className="font-medium tracking-wide text-gray-700">
                                        Comment
                                    </h5>
                                    <textarea
                                        value={comment}
                                        onChange={e => setComment(e.target.value)}
                                        className="border-2 border-gray-600 rounded-lg p-3 w-full"
                                    />
                                </div>
                            </form>
                        )}
                    </section>
                </main>
            </section>
        </>
    );
}

export default Comments;
