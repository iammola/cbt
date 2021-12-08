import useSWR from "swr";
import Head from "next/head";
import type { NextPage } from "next";
import { useCookies } from "react-cookie";
import { formatRelative } from "date-fns";
import { useEffect, useState } from "react";

import Select from "components/Select";
import { UserImage } from "components/Misc";
import { Navbar, Sidebar } from "components/Layout";

import type { TeacherCBTResultsGETData } from "types/api/teachers";
import type { SelectOption, RouteData, ClientResponse } from "types";
import type { ClassesGETData, ClassExamGETData } from "types/api/classes";

const Results: NextPage = () => {
    const [{ account }] = useCookies(['account']);
    const [exams, setExams] = useState<SelectOption[]>();
    const { data: classes, error } = useSWR<RouteData<ClassesGETData>>(account !== undefined ? `/api/teachers/${account._id}/classes` : null, url => fetch(url ?? '').then(res => res.json()));

    const [results, setResults] = useState<TeacherCBTResultsGETData>();
    const [selectedExam, setSelectedExam] = useState({ _id: "", name: "Select exam" });
    const [selectedClass, setSelectedClass] = useState({ _id: "", name: "Loading classes..." });

    useEffect(() => {
        setSelectedClass({
            _id: "",
            name: (error !== undefined && classes === undefined) ? "Error Loading Classes" : (classes === undefined ? "Loading classes..." : "Select class")
        });
    }, [classes, error]);

    useEffect(() => {
        const { _id } = selectedClass;

        async function getExams() {
            setExams([]);
            setSelectedExam({ _id: "", name: "Loading exams..." });

            try {
                const res = await fetch(`/api/classes/${_id}/exams`);
                const result = await res.json() as ClientResponse<ClassExamGETData>;

                if (result.success === true) {
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
                const result = await res.json() as ClientResponse<TeacherCBTResultsGETData>;

                if (result.success === true) {
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
                <meta name="description" content="Written Results | GRS CBT" />
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
                                    buttonOffsetFocusColor: "focus-visible:ring-offset-indigo-500"
                                }}
                                handleChange={setSelectedExam}
                            />
                            <button
                                onClick={getData}
                                className="px-4 py-3 rounded-md shadow-md bg-gray-500 hover:bg-gray-600 text-white text-xs mb-3 min-w-max"
                            >
                                Load Results
                            </button>
                        </div>
                        {results !== undefined && (
                            <table className="rounded-lg shadow-md overflow-hidden min-w-full">
                                <thead className="bg-gray-200 text-gray-700">
                                    <tr>
                                        {["Student", "Score", "Date"].map(i => (
                                            <th
                                                key={i}
                                                scope="col"
                                                className="py-5"
                                            >
                                                <span className="flex items-center justify-start pl-6 pr-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    {i}
                                                </span>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200 text-gray-600">
                                    {results.map(({ student, results }) => (
                                        <tr
                                            key={student._id.toString()}
                                            className="text-sm font-medium"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-4">
                                                    <div className="shrink-0 h-10 w-10 relative">
                                                        <UserImage
                                                            src=""
                                                            layout="fill"
                                                            objectFit="cover"
                                                            objectPosition="center"
                                                            className="rounded-full"
                                                            initials={{
                                                                text: student.name.initials,
                                                                className: "rounded-full bg-indigo-300"
                                                            }}
                                                        />
                                                    </div>
                                                    <span>
                                                        {student.name.full}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {results[0].score}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {(() => {
                                                    const date = formatRelative(new Date(results[0].started), new Date());
                                                    return date[0].toUpperCase() + date.slice(1)
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
}

export default Results;
