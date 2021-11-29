import Head from "next/head";
import { NextPage } from "next";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useCookies } from "react-cookie";
import useSWRImmutable from "swr/immutable";

import { useNotifications } from "components/Misc/Notification";
import { Bar, Grid, Loader, Modal, Timer, Question } from "components/Exam/Student";

import type { ClientResponse, RouteData, UserRecord } from "types";
import type { ExamGETData } from "types/api/exams";
import type { StudentResultPOSTData } from "types/api/students";
import { BanIcon, BellIcon, DesktopComputerIcon } from "@heroicons/react/outline";

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

    const [firstLoad, setFirstLoad] = useState(true);

    const [success, setSuccess] = useState<boolean | undefined>();
    const [loading, setLoading] = useState(false);
    const [modified, setModified] = useState(false);

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

    async function handleSubmit(e?: FormEvent<HTMLFormElement>) {
        e?.preventDefault();

        if (e === undefined) {
            setLoading(true);

            try {
                const res = await fetch(`/api/students/${cookies.account?._id}/results/`, {
                    method: "POST",
                    body: JSON.stringify(cookies.exam)
                });
                const result = await res.json() as ClientResponse<StudentResultPOSTData>;

                setSuccess(result.success);
                setTimeout(setSuccess, 75e2, undefined);

                if (result.success === true) {
                    addNotification({
                        timeout: 5e3,
                        message: `Result saved 👍...  Score: ${result.data.score}`,
                        Icon: () => <BellIcon className="w-6 h-6 stroke-sky-500" />
                    });
                    removeCookies("exam");
                    setTimeout(router.push, 1e3, '/home');
                } else throw new Error(result.error);
            } catch (error: any) {
                addNotification([{
                    timeout: 5e3,
                    message: "Error saving result",
                    Icon: () => <BanIcon className="w-6 h-6 stroke-red-600" />
                }, {
                    timeout: 3e3,
                    message: "Retrying in 3 seconds",
                    Icon: () => <DesktopComputerIcon className="w-6 h-6 stroke-emerald-500" />
                }]);
                // setTimeout(handleSubmit, 25e2);
            }

            setLoading(false);
        } else {
            /* // TODO: Toggle Confirm Modal */
            handleSubmit(undefined);
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
            <form
                onSubmit={handleSubmit}
                className="flex flex-col items-center justify-start w-screen min-h-screen"
            >
                <Bar
                    loading={loading}
                    success={success}
                    exam={exam?.data.details.name}
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
                <Timer timeout={exam?.data.details.duration} />
            </form>
            {Notifications}
        </>
    );
}

export default WriteExam;
