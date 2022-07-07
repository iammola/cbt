import Head from "next/head";
import dynamic from "next/dynamic";
import type { NextPage } from "next";
import { useCookies } from "react-cookie";
import { Fragment } from "react";

import type { LoginData } from "types/api";

const StudentHome = dynamic(import("components/Home/Student"));
const TeacherHome = dynamic(import("components/Home/Teacher"));
const GroupedUserHome = dynamic(import("components/Home/GroupedUser"));

const Home: NextPage = () => {
  const [{ account }] = useCookies<"account", { account?: LoginData }>(["account"]);

  return (
    <Fragment>
      <Head>
        <title>Home | CBT | Grand Regal School</title>
        <meta
          name="description"
          content="Home | GRS CBT"
        />
      </Head>
      {account?.access === "Teacher" && <TeacherHome />}
      {account?.access === "Student" && <StudentHome />}
      {account?.access === "GroupedUser" && <GroupedUserHome />}
    </Fragment>
  );
};

export default Home;
