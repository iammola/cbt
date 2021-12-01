import Head from "next/head";
import type { NextPage } from "next";

import { Form } from "components/Exam/Teacher";

const CreateExams: NextPage = () => {
    return (
        <>
            <Head>
                <title>Create Exam | CBT | Grand Regal School</title>
                <meta name="description" content="Exam Registration | GRS CBT" />
            </Head>
            <Form />
        </>
    );
}

export default CreateExams;
