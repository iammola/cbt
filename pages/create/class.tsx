import Head from "next/head";
import { NextPage } from "next";

import ClassForm from "components/ClassForm";
import SubjectForm from "components/SubjectForm";

const CreateClass: NextPage = () => {
    return (
        <>
            <Head>
                <title>Create a Class | CBT | Grand Regal School</title>
                <meta name="description" content="Class Registration Page | GRS CBT" />
            </Head>
            <section className="flex flex-col md:flex-row items-center justify-center gap-y-20 md:gap-y-0 gap-x-0 md:gap-x-10 p-10 w-screen min-h-screen">
                <ClassForm />
                <SubjectForm />
            </section>
        </>
    );
}

export default CreateClass;
