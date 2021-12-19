import Head from "next/head";
import type { NextPage } from "next";

const ResultsPicker: NextPage = () => {
    return (
        <section className="flex flex-col gap-7 items-center justify-center w-screen h-screen">
            <Head>
                <title>Results Picker | Portal | Grand Regal School</title>
                <meta name="description" content="Results | GRS Portal" />
            </Head>
        </section>
    );
}

export default ResultsPicker;
