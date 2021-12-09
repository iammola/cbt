import useSWR from "swr";
import Head from "next/head";
import type { NextPage } from "next";
import { useState, useEffect } from "react";

import Select from "components/Select";
import { Sidebar, Navbar } from "components/Layout";

import type { RouteData } from "types";
import type { ClassesGETData } from "types/api/classes";

const Comments: NextPage = () => {
    const [selectedClass, setSelectedClass] = useState({ _id: "", name: "Loading classes..." });
    const { data: classes, error } = useSWR<RouteData<ClassesGETData>>("/api/classes?select=name", url => fetch(url).then(res => res.json()));

    useEffect(() => {
        setSelectedClass({
            _id: "",
            name: (error !== undefined && classes === undefined) ? "Error Loading Classes" : (classes === undefined ? "Loading classes..." : "Select class")
        });
    }, [classes, error]);

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
                                handleChange={setSelectedClass}
                            />
                            <button className="px-4 py-3 rounded-md shadow-md bg-gray-500 hover:bg-gray-600 text-white text-xs mb-3 min-w-max">
                                Load Comments
                            </button>
                        </div>
                    </section>
                </main>
            </section>
        </>
    );
}

export default Comments;
