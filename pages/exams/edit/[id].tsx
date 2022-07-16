import dynamic from "next/dynamic";
import Head from "next/head";
import { useEffect } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useCookies } from "react-cookie";
import useSWRImmutable from "swr/immutable";

import { Loader } from "components/Exam/Teacher";

import type { RouteData } from "types";
import type { TeacherExamGETData } from "types/api";

const Form = dynamic(import("components/Exam/Teacher/Form"));

const EditExam: NextPage = () => {
  const router = useRouter();
  const [{ account }] = useCookies(["account"]);
  const { data: exam } = useSWRImmutable<RouteData<TeacherExamGETData>>(
    router.query.id !== undefined ? `/api/teachers/${account?._id}/exams/${router.query.id}/` : null
  );

  useEffect(() => {
    if (exam !== undefined && exam.data === undefined) router.push("/home");
  }, [exam, router]);

  return (
    <>
      <Head>
        <title>Edit Exam | CBT | Grand Regal School</title>
        <meta
          name="description"
          content="Exam Editing | GRS CBT"
        />
      </Head>
      <Form data={exam?.data} />
      <Loader show={exam?.data === undefined} />
    </>
  );
};

export default EditExam;
