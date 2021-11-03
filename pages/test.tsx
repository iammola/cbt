import Head from "next/head";
import { NextPage } from "next";

import { Navbar, Sidebar } from "components/Layout";

const Tests: NextPage = () => {
    return (
        <>
            <Head>
                <title>Tests | GRS CBT | Grand Regal School</title>
                <meta name="description" content="GRS CBT Tests" />
            </Head>
            <section className="flex items-center justify-start w-screen divide-y-[1.5px] divide-gray-200">
                <Sidebar />
                <main className="flex flex-col flex-grow items-center justify-center divide-x-[1.5px] divide-gray-200 h-full">
                    <Navbar />
                    <section className="flex flex-col gap-5 items-start justify-center w-full py-7 px-6 flex-grow bg-gray-50">
                        <h2 className="text-5xl font-bold text-gray-700">
                            Dashboard
                        </h2>
                    </section>
                </main>
            </section>
        </>
    );
}

export default Tests;
