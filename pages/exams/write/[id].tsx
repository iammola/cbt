import Head from "next/head";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useCookies } from "react-cookie";
import useSWRImmutable from "swr/immutable";

import { useNotifications } from "components/Misc/Notification";
import { Bar, Grid, Loader, Modal, Timer, Question } from "components/Exam/Student";

import type { ClientResponse, RouteData, UserRecord } from "types";
import type { ExamGETData } from "types/api/exams";
import type { StudentResultPOSTData } from "types/api/students";
import { BanIcon, BellIcon, DatabaseIcon } from "@heroicons/react/outline";

type PageCookies = {
    exam?: {
        started: Date;
        examId: string;
        answers: { [questionId: string]: string; }
    };
    account?: UserRecord;
}

const WriteExam: NextPage = () => {
    const [addNotification, , Notifications] = useNotifications();
    const router = useRouter();
    const [cookies, setCookies, removeCookies] = useCookies<"exam" | "account", PageCookies>(['exam', 'account']);
    const [answered, setAnswered] = useState<{ [QuestionId: string]: string }>({});
    const { data: exam } = useSWRImmutable<RouteData<ExamGETData>>(router.query.id !== undefined ? `/api/exams/${router.query.id}/` : null, url => fetch(url ?? '').then(res => res.json()));

    const [started, setStarted] = useState(false);
    const [firstLoad, setFirstLoad] = useState(true);

    const [modified, setModified] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState<'' | 0 | 1 | -1>('');

    useEffect(() => {
        if (modified === true && firstLoad === false) {
            setCookies("exam", JSON.stringify({
                ...cookies.exam,
                answers: answered
            }), { path: '/exams/write/' });
            setModified(false);
        }
    }, [answered, cookies.exam, firstLoad, modified, setCookies]);

    useEffect(() => {
        if (Object.keys(answered).length > 0) setModified(true);
    }, [answered]);

    useEffect(() => {
        if (firstLoad === true && cookies.exam === undefined && exam !== undefined) {
            setFirstLoad(false);
            setCookies("exam", JSON.stringify({
                answers: {},
                started: new Date(),
                examId: exam.data._id,
            }), { path: '/exams/write/' });
        }
    }, [cookies.exam, exam, firstLoad, setCookies]);

    useEffect(() => {
        const { answers, examId } = cookies.exam ?? { answers: {} };
        if (firstLoad === true && examId === router.query.id && Object.keys(answers).length > 0) {
            setFirstLoad(false);
            setAnswered(answers);
        }
    }, [cookies.exam, firstLoad, router.query.id]);

    async function handleSubmit() {
        setSuccess(-1);

        try {
            const res = await fetch(`/api/students/${cookies.account?._id}/results/`, {
                method: "POST",
                body: JSON.stringify(cookies.exam)
            });
            const result = await res.json() as ClientResponse<StudentResultPOSTData>;

            if (result.success === true) {
                setSuccess(1);
                addNotification({
                    timeout: 5e3,
                    message: `Result saved 👍...  Score: ${result.data.score}`,
                    Icon: () => <BellIcon className="w-6 h-6 stroke-sky-500" />
                });
                removeCookies("exam");
                setTimeout(router.push, 1e3, '/home');
            } else throw new Error(result.error);
        } catch (error: any) {
            setSuccess(0);
            addNotification([{
                timeout: 5e3,
                message: "Error saving result",
                Icon: () => <BanIcon className="w-6 h-6 stroke-red-600" />
            }, {
                timeout: 2e3,
                message: error.message,
                Icon: () => <DatabaseIcon className="w-6 h-6 stroke-sky-500" />
            }]);
            setTimeout(setSuccess, 25e2, '');
        }
    }

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
                <Bar
                    exam={exam?.data.details.name}
                    onSubmit={() => setSubmitting(true)}
                />
                <div className="flex grow gap-6 items-center justify-center w-full h-full pt-6 px-12 bg-gray-50">
                    <div className="flex flex-col items-start justify-start h-full w-[18rem] py-8">
                        <Grid
                            questions={exam?.data?.questions?.map(({ _id }) => ({
                                answered: !!answered[_id.toString()],
                            })) ?? []}
                        />
                    </div>
                    <div className="grow h-full px-14 py-8">
                        <div className="max-w-5xl h-full space-y-10">
                            {exam?.data.questions.map((question, questionIdx) => (
                                <Question
                                    {...question}
                                    key={questionIdx}
                                    chosen={answered[question._id.toString()]}
                                    onAnswer={AnswerID => setAnswered({
                                        ...answered,
                                        [question._id.toString()]: AnswerID.toString()
                                    })}
                                />
                            ))}
                        </div>
                    </div>
                </div>
                <Timer
                    started={started}
                    submit={() => setSubmitting(true)}
                    timeout={exam?.data.details.duration}
                />
            </form>
            <Loader
                start={() => setStarted(true)}
                exam={exam === undefined ? undefined : {
                    ...exam.data.details.name,
                    duration: exam.data.details.duration,
                    questions: exam.data.questions.length,
                    instructions: exam.data.details.instructions
                }}
                show={exam === undefined || started === false}
            />
            <Modal
                show={submitting}
                success={success}
                confirm={handleSubmit}
                close={() => setSubmitting(false)}
            />
            {Notifications}
        </>
    );
}

export default WriteExam;
