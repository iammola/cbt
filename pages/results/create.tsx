import useSWR from "swr";
import Head from "next/head";
import { useEffect, useState } from "react";
import type { NextPage } from "next";

import Select from "components/Select";

import type { ClientResponse, RouteData, RouteError } from "types";
import type { ClassesGETData, ClassSubjectGETData } from "types/api/classes";

const Results: NextPage = () => {
    const [subjects, setSubjects] = useState<{ _id: any; name: string; }[]>([]);
    const { data: classes } = useSWR<RouteData<ClassesGETData>, RouteError>('/api/classes/?select=name', url => fetch(url).then(res => res.json()));
    
    const [selectedClass, setSelectedClass] = useState({
        _id: "",
        name: "Select class"
    });
    const [selectedSubject, setSelectedSubject] = useState({
        _id: "",
        name: "Select subject"
    });

    useEffect(() => {
        async function fetchSubjects() {
            setSubjects([]);
            setSelectedSubject({
                _id: "",
                name: "Select subject"
            });

            try {
                const res = await fetch(`/api/classes/${selectedClass._id}/subjects`);
                const result = await res.json() as ClientResponse<ClassSubjectGETData>;

                if (result.success === true) setSubjects(result.data?.subjects ?? []);
                else throw new Error(result.error);
            } catch (error: any) {
                console.log({ error });
            }
        }

        if (selectedClass._id !== "") fetchSubjects();
    }, [selectedClass]);

    return (
        <>
            <Head>
                <title>Results | Portal | Grand Regal School</title>
                <meta name="description" content="Results | GRS Portal" />
            </Head>
            <section className="flex flex-col items-start justify-start w-screen h-screen p-10">
                <h3 className="text-5xl font-bold text-gray-800 pb-4">
                    Results
                </h3>
                <div className="flex gap-4 items-center justify-center w-full">
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
                        label="Subject"
                        options={subjects}
                        selected={selectedSubject}
                        colorPallette={{
                            activeCheckIconColor: "stroke-indigo-600",
                            inactiveCheckIconColor: "stroke-indigo-800",
                            activeOptionColor: "text-indigo-900 bg-indigo-100",
                            buttonBorderColor: "focus-visible:border-indigo-500",
                            buttonOffsetFocusColor: "focus-visible:ring-offset-indigo-500"
                        }}
                        handleChange={setSelectedSubject}
                    />
                </div>
            </section>
        </>
    );
}

export default Results;
