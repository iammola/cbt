import Head from "next/head";
import type { NextPage } from "next";

import { SessionForm, TermForm } from "components/Form";

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
      <section className="flex min-h-screen w-screen flex-col items-center justify-center gap-y-20 gap-x-0 bg-gradient-to-tr from-yellow-400 to-pink-500 p-10 md:flex-row md:gap-y-0 md:gap-x-10">
        <SessionForm />
        <TermForm />
      </section>
    </>
  );
};

export default CreateSession;
