import Head from "next/head";
import type { NextPage } from "next";

const Result: NextPage = () => {
    return (
        <section className="flex items-center justify-center w-screen min-h-screen bg-gray-200 p-10 xl:p-20 2xl:p-24">
            <Head>
                <title>Student • Results | CBT | Grand Regal School</title>
                <meta name="description" content="Student • Results | GRS CBT" />
            </Head>
        </section>
    );
}

export default Result;
