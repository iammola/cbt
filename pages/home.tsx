import Head from "next/head";
import dynamic from "next/dynamic";
import type { NextPage } from "next";
import { useCookies } from "react-cookie";

import type { LoginData } from "types/api/login";

const StudentHome = dynamic(() => import("components/Home/Student"), { ssr: false });
const TeacherHome = dynamic(() => import("components/Home/Teacher"), { ssr: false });

const Home: NextPage = () => {
    const [{ account }] = useCookies<"account", { account?: LoginData }>(['account']);

    return (
        <>
            <Head>
                <title>Home | CBT | Grand Regal School</title>
                <meta name="description" content="Home | GRS CBT" />
            </Head>
            {account !== undefined && (account.access === "Teacher" ? (
                <TeacherHome />
            ) : (
                <StudentHome />
            ))}
        </>
    )
}

export default Home;
