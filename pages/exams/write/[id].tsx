import Head from "next/head";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useCookies } from "react-cookie";
import useSWRImmutable from "swr/immutable";

import { Bar, Grid, Timer, Question } from "components/Exam/Student";

import type { RouteData, UserRecord } from "types";
import type { ExamGETData } from "types/api/exams";

type PageCookies = {
    exam?: {
        started: Date;
        examId: string;
        answers: { [questionId: string]: string; }
    };
    account?: UserRecord;
}

const WriteExam: NextPage = () => {
    const router = useRouter();
    const [modified, setModified] = useState(false);
    const [cookies, setCookies, removeCookies] = useCookies<"exam" | "account", PageCookies>(['exam', 'account']);
    const [answeredQuestions, setAnsweredQuestions] = useState<{ [QuestionId: string]: string }>({});
    const { data: exam } = useSWRImmutable<RouteData<ExamGETData>>(router.query.id !== undefined ? `/api/exams/${router.query.id}/` : null, url => fetch(url ?? '').then(res => res.json()));

    useEffect(() => {
        if (modified === true) setCookies("savedAnswers", JSON.stringify(answeredQuestions), { path: '/' });
    }, [answeredQuestions, modified, setCookies]);

    useEffect(() => {
        setModified(true);
    }, [answeredQuestions]);

    return (
        <>
            <Head>
                <title>Subject | Event | Exam | CBT | Grand Regal School</title>
                <meta name="description" content="Subject Exam | GRS CBT" />
                <style>{`
                    #main,
                    body { overflow: unset !important; }
                `}</style>
            </Head>
            <form className="flex flex-col items-center justify-start w-screen min-h-screen">
                <Bar exam={exam?.data.details.name} />
                <div className="flex grow gap-6 items-center justify-center w-full h-full pt-6 px-12 bg-gray-50">
                    <div className="flex flex-col items-start justify-start h-full w-[18rem] py-8">
                        <Grid
                            questions={exam?.data.questions.map(({ _id }) => ({
                                answered: !!answeredQuestions[_id.toString()],
                            })) ?? []}
                        />
                    </div>
                    <div className="grow h-full px-14 py-8">
                        <div className="max-w-5xl h-full space-y-10">
                            {exam?.data.questions.map((question, questionIdx) => (
                                <Question
                                    {...question}
                                    key={questionIdx}
                                    chosen={answeredQuestions[question._id.toString()]}
                                    onAnswer={AnswerID => setAnsweredQuestions({
                                        ...answeredQuestions,
                                        [question._id.toString()]: AnswerID.toString()
                                    })}
                                />
                            ))}
                        </div>
                    </div>
                </div>
                <Timer timeout={exam?.data.details.duration} />
            </form>
        </>
    );
}

export default WriteExam;
