import Head from "next/head";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import useSWRImmutable from "swr/immutable";

import { Form, Loader } from "components/Exam/Teacher";

import type { RouteData } from "types";
import type { TeacherExamGETData } from "types/api/teachers";

const EditExam: NextPage = () => {
    const router = useRouter();
    const { data: exam } = useSWRImmutable<RouteData<TeacherExamGETData>>(router.query.id !== undefined ? `/api/exams/${router.query.id}/` : null, url => fetch(url ?? '').then(res => res.json()));

    return (
        <>
            <Head>
                <title>Edit Exam | CBT | Grand Regal School</title>
                <meta name="description" content="Exam Editing | GRS CBT" />
            </Head>
            <Form data={exam?.data} />
            <Loader show={exam === undefined} />
        </>
    );
}

export default EditExam;
