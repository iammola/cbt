import Head from "next/head";
import type { NextPage } from "next";

import ClassForm from "components/Form/ClassForm";
import SubjectForm from "components/Form/SubjectForm";

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
      <section className="flex flex-col md:flex-row items-center justify-center gap-y-20 md:gap-y-0 gap-x-0 md:gap-x-10 bg-gradient-to-tr from-blue-400 to-purple-500 p-10 w-screen min-h-screen">
        <ClassForm />
        <SubjectForm />
      </section>
    </>
  );
};

export default CreateClass;
