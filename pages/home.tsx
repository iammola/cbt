import Head from "next/head";
import type { NextPage } from "next";

import { Todo, Subjects } from "components/Misc";
import { Navbar, Sidebar } from "components/Layout";

const Home: NextPage = () => {
    const todoItems = [{
        name: "Physics",
        date: new Date("August 2021"),
        class: "Key Stage 1"
    }, {
        name: "Mathematics",
        date: new Date("10 December 2004"),
        class: "Senior College 2"
    }, {
        name: "Civic Education",
        date: new Date(),
        class: "Early Years 2"
    }, {
        name: "English Language",
        date: new Date('10 December 2020'),
        class: "Upper Key Stage 2"
    }];

    const subjectsItems = [{
        name: "Key Stage 1",
        subjects: [{
            name: "Physics"
        }, {
            name: "Mathematics"
        }, {
            name: "Civic Education"
        }, {
            name: "English Language"
        }]
    }, {
        name: "Key Stage 2",
        subjects: [{
            name: "FInancial Accounting"
        }, {
            name: "Mathematics"
        }, {
            name: "Further Mathematics"
        }, {
            name: "English Language"
        }]
    }, {
        name: "Upper Key Stage 2",
        subjects: [{
            name: "Biology"
        }, {
            name: "Mathematics"
        }, {
            name: "Pre-Vocational Studies"
        }, {
            name: "Basic Science and Technology"
        }]
    }];

    return (
        <>
            <Head>
                <title>Home | CBT | Grand Regal School</title>
                <meta name="description" content="Home | GRS CBT" />
            </Head>
            <section className="flex items-center justify-start w-screen h-screen divide-y-[1.5px] divide-gray-200">
                <Sidebar />
                <main className="flex flex-col flex-grow items-center justify-center divide-x-[1.5px] divide-gray-200 h-full">
                    <Navbar />
                    <section className="flex flex-col gap-7 items-start justify-start w-full py-7 px-6 flex-grow bg-gray-50 overflow-y-auto">
                        <h2 className="text-3xl sm:text-5xl font-bold text-gray-700">
                            Dashboard
                        </h2>
                        <div className="grid grid-cols-1 xl:grid-cols-12 grid-row-2 xl:grid-rows-6 gap-5 flex-grow w-full rounded-lg">
                            <div className="flex flex-col items-start justify-center col-start-1 col-end-2 xl:col-end-10 row-start-1 row-end-2 xl:row-end-5 rounded-3xl shadow-md px-7 py-8 bg-white">
                                <h5 className="font-semibold text-gray-700 pl-1 pb-4">
                                    Exams to Register
                                </h5>
                                <Todo items={todoItems} />
                            </div>
                            <div className="col-start-1 xl:col-start-10 col-end-2 xl:col-end-13 row-start-2 xl:row-start-1 row-end-3 xl:row-end-7 rounded-3xl shadow-md px-7 py-8 bg-white">
                                <h5 className="font-semibold text-gray-700 pl-1 pb-4">
                                    Subjects
                                </h5>
                                <Subjects items={subjectsItems} />
                            </div>
                        </div>
                    </section>
                </main>
            </section>
        </>
    )
}

export default Home;
