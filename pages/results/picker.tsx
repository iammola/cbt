import useSWR from "swr";
import Head from "next/head";
import type { NextPage } from "next";

import type { RouteData } from "types";
import type { ClassesGETData } from "types/api/classes";

const ResultsPicker: NextPage = () => {
    const { data: classes } = useSWR<RouteData<ClassesGETData>>(`/api/classes/?select=name`, url => fetch(url ?? '').then(res => res.json()));

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
