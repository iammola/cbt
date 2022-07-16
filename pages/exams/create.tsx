import dynamic from "next/dynamic";
import Head from "next/head";
import type { NextPage } from "next";

const Form = dynamic(import("components/Exam/Teacher/Form"));

const CreateExams: NextPage = () => {
  return (
    <>
      <Head>
        <title>Create Exam | CBT | Grand Regal School</title>
        <meta
          name="description"
          content="Exam Registration | GRS CBT"
        />
      </Head>
      <Form />
    </>
  );
};

export default CreateExams;
