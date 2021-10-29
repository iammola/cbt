import Head from "next/head";
import { NextPage } from "next";

import { Navbar, Sidebar } from "components/Layout";

const Home: NextPage = () => {
    return (
        <>
            <Head>
                <title>Home | CBT | Grand Regal School</title>
                <meta name="description" content="Home | GRS CBT" />
            </Head>
            <section className="flex flex-col items-center justify-start w-screen divide-y-[1.5px] divide-gray-200">
                <Navbar />
                <main className="flex flex-col md:flex-row divide-x-[1.5px] divide-gray-200 w-full h-full">
                    <section className="flex-grow w-full h-full"></section>
                    <Sidebar />
                </main>
            </section>
        </>
    )
}

export default Home;
