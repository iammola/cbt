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
                    <section className="w-full flex-grow bg-gray-50"></section>
                </main>
            </section>
        </>
    );
}

export default Tests;
