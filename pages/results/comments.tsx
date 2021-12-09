import Head from "next/head";
import type { NextPage } from "next";

import { Sidebar, Navbar } from "components/Layout";

const Comments: NextPage = () => {
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
                    </section>
                </main>
            </section>
        </>
    );
}

export default Comments;
