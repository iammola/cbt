import Head from "next/head";
import type { NextPage } from "next";

import { ClassForm, SubjectForm } from "components/Form";

const CreateClass: NextPage = () => {
  return (
    <>
      <Head>
        <title>Create a Class // Subject | CBT | Grand Regal School</title>
        <meta
          name="description"
          content="Class // Subject Registration | GRS CBT"
        />
      </Head>
      <section className="flex min-h-screen w-screen flex-col items-center justify-center gap-y-20 gap-x-0 bg-gradient-to-tr from-blue-400 to-purple-500 p-10 md:flex-row md:gap-y-0 md:gap-x-10">
        <ClassForm />
        <SubjectForm />
      </section>
    </>
  );
};

export default CreateClass;
