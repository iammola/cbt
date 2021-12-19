import useSWR from "swr";
import Head from "next/head";
import type { NextPage } from "next";
import { useEffect, useState } from "react";

import type { ClientResponse, RouteData } from "types";
import type { ClassesGETData, ClassStudentsGETData } from "types/api/classes";

const ResultsPicker: NextPage = () => {
    const [students, setStudents] = useState<{ class: any; students: ClassStudentsGETData; }[]>([]);
    const { data: classes } = useSWR<RouteData<ClassesGETData>>(`/api/classes/?select=name`, url => fetch(url ?? '').then(res => res.json()));

    useEffect(() => {
        async function getStudents(classes: ClassesGETData) {
            await Promise.all(classes.map(async ({ _id }) => {
                const res = await fetch(`/api/classes/${_id}/students/`);
                const result = await res.json() as ClientResponse<ClassStudentsGETData>;

                if (result.success === true) setStudents(students => [...students.filter(j => j.class !== _id), {
                    class: _id,
                    students: result.data
                }]);
            }));
            console.log("Loaded Students");
        }

        if (classes !== undefined) getStudents(classes.data);
    }, [classes]);

    return (
        <section className="flex flex-col gap-7 items-center justify-center w-screen h-screen">
            <Head>
                <title>Results Picker | Portal | Grand Regal School</title>
                <meta name="description" content="Results | GRS Portal" />
            </Head>
            <h3 className="text-5xl font-bold tracking-wide text-gray-800">
                Load results for all students in a class
            </h3>
            <div className="flex flex-wrap gap-4 items-center justify-center w-full px-10">
                {classes?.data.map(item => {
                    const data = students.find(element => element.class === item._id)?.students ?? [];

                    return data?.length > 0 && (
                        <div
                            key={item.name}
                            className="flex gap-6 items-center justify-center px-4 py-3 h-16 rounded-full shadow select-none cursor-pointer"
                        >
                            <span className="text-sm font-medium text-gray-700">
                                {item.name}
                            </span>
                            <span className="text-xs text-gray-400">
                                {data.length} student{data.length > 1 && "s"}
                            </span>
                        </div>
                    );
                })}
            </div>
            <span className="text-gray-600 tracking-widest font-medium">
                or
            </span>
            <h3 className="text-5xl font-bold tracking-wide text-gray-800">
                Load for a single student
            </h3>
        </section>
    );
}

export default ResultsPicker;
