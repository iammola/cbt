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
