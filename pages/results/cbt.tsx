import Head from "next/head";
import type { NextPage } from "next";

import Select from "components/Select";
import { Navbar, Sidebar } from "components/Layout";

const Results: NextPage = () => {
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
                        <div className="flex gap-4 items-center justify-center w-full">
                            <Select
                                label="Class"
                                options={undefined}
                                selected={{ _id: "", name: "" }}
                                colorPallette={{
                                    activeCheckIconColor: "stroke-indigo-600",
                                    inactiveCheckIconColor: "stroke-indigo-800",
                                    activeOptionColor: "text-indigo-900 bg-indigo-100",
                                    buttonBorderColor: "focus-visible:border-indigo-500",
                                    buttonOffsetFocusColor: "focus-visible:ring-offset-indigo-500"
                                }}
                                handleChange={() => { }}
                            />
                            <Select
                                label="Exam"
                                options={undefined}
                                selected={{ _id: "", name: "" }}
                                colorPallette={{
                                    activeCheckIconColor: "stroke-indigo-600",
                                    inactiveCheckIconColor: "stroke-indigo-800",
                                    activeOptionColor: "text-indigo-900 bg-indigo-100",
                                    buttonBorderColor: "focus-visible:border-indigo-500",
                                    buttonOffsetFocusColor: "focus-visible:ring-offset-indigo-500"
                                }}
                                handleChange={() => { }}
                            />
                            <button className="px-4 py-3 rounded-md shadow-md bg-gray-500 hover:bg-gray-600 text-white text-sm">
                                Load Results
                            </button>
                        </div>
                    </section>
                </main>
            </section>
        </>
    );
}

export default Results;
