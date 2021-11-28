import Head from "next/head";
import type { NextPage } from "next";

import { TeacherHome } from "components/Home";

const Home: NextPage = () => {
    return (
        <>
            <Head>
                <title>Home | CBT | Grand Regal School</title>
                <meta name="description" content="Home | GRS CBT" />
            </Head>
            <TeacherHome />
        </>
    )
}

export default Home;
