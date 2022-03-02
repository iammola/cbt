import Head from "next/head";
import type { NextPage } from "next";

import { SessionForm } from "components/Form";

const CreateSession: NextPage = () => {
  return (
    <>
      <Head>
        <title>
          Create a School Session // Term | CBT | Grand Regal School
        </title>
        <meta
          name="description"
          content="School Session // Term Registration | GRS CBT"
        />
      </Head>
      <section className="flex min-h-screen w-screen items-center justify-center bg-gradient-to-tr from-yellow-400 to-pink-500 p-10">
        <SessionForm />
      </section>
    </>
  );
};

export default CreateSession;
