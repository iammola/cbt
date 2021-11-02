import useSWR from "swr";
import Head from "next/head";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useCookies } from "react-cookie";
import { FormEvent, Fragment, useMemo, useState } from "react";
import { CheckIcon, ChevronRightIcon, PlusSmIcon } from "@heroicons/react/solid";
import { CheckCircleIcon, XCircleIcon, BellIcon } from "@heroicons/react/outline";

import ExamModal from "components/Exam/Modal";
import Question from "components/Exam/Question";
import { LoadingIcon } from "components/Misc/Icons";
import Notification, { NotificationProps } from "components/Misc/Notification";

import { CreateQuestion } from "types";

const CreateQuestions: NextPage = () => {
    const router = useRouter();
    const [{ savedExams }, setCookies] = useCookies(['savedExams']);
    const { data: currentSession } = useSWR('/api/sessions/current/', url => fetch(url).then(res => res.json()));

    const recordTemplate = useMemo<CreateQuestion>(() => ({
        question: "",
        type: "Multiple choice",
        answers: [{ answer: "", isCorrect: true }, { answer: "" }],
        max: undefined,
        min: undefined,
        minLength: undefined,
        maxLength: undefined
    }), []);
    const [exam, setExam] = useState<any>();
    const [questions, setQuestions] = useState<CreateQuestion[]>([{ ...recordTemplate }]);

    const [uploading, setUploading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [notifications, setNotifications] = useState<Omit<NotificationProps, 'removeIcon'>[]>([]);

    function saveExam(obj?: { [key: string]: any }) {
        if (exam !== undefined) {
            setCookies('savedExams', JSON.stringify(obj ?? {
                ...(savedExams ?? {}),
                [exam.details.SubjectID]: { exam, questions }
            }), {
                path: '/',
                sameSite: true,
                expires: new Date('2038-01-19')
            });
        }
    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (exam !== undefined) {
            setUploading(true);

            try {
                const res = await fetch('/api/exams/', {
                    method: "POST",
                    body: JSON.stringify({
                        questions,
                        exam: exam.details,
                    })
                });

                const { success, error } = await res.json();

                setSuccess(success);

                if (success === true) {
                    setTimeout(router.reload, 35e2);
                    setNotifications([...notifications, {
                        message: "Upload Success... Reloading",
                        timeout: 3e3,
                        Icon: () => CheckCircleIcon({ className: "w-6 h-6 text-green-700" }),
                    }]);
                    saveExam(Object.fromEntries(Object.entries(savedExams ?? {}).filter(([key]) => key !== exam.details.SubjectID)));
                } else throw new Error(error);
            } catch (error) {
                saveExam();
                console.error(error);
                setNotifications([...notifications, {
                    message: "Upload Failed... Try again",
                    timeout: 5e3,
                    Icon: () => XCircleIcon({ className: "w-6 h-6 text-red-700" }),
                }, {
                    message: "Exam Saved Locally",
                    timeout: 3e3,
                    Icon: () => BellIcon({ className: "w-6 h-6 text-blue-700" })
                }]);
            }

            setUploading(false);
        }
    }

    return (
        <>
            <Head>
                <title>Create Exam | CBT | Grand Regal School</title>
                <meta name="description" content="Exam Registration | GRS CBT" />
            </Head>
            <section className="flex flex-col items-center justify-center gap-2 w-screen">
                <div className="flex items-center justify-start gap-2 text-gray-400 pt-7 pb-2 px-10 w-full text-sm font-medium">
                    <span>
                        {currentSession !== undefined ? (
                            currentSession.data !== null ? (
                                <>
                                    <span className="inline-block sm:hidden">
                                        {currentSession.data.alias}{' '}
                                        {currentSession.data.terms[0].alias}
                                    </span>
                                    <span className="hidden sm:inline-block">
                                        {currentSession.data.name}{' '}
                                        {currentSession.data.terms[0].name}
                                    </span>{' '}Term
                                </>
                            ) : "No Current Session"
                        ) : "Loading Session"}
                    </span>
                    <ChevronRightIcon className="w-5 h-5 text-gray-500" />
                    <span>{exam?.class ?? "Select Class"}</span>
                    <ChevronRightIcon className="w-5 h-5 text-gray-500" />
                    <span>{exam?.subject ?? "Select Subject"}</span>
                    <ChevronRightIcon className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-600">Questions</span>
                </div>
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col items-center justify-start gap-10 w-full flex-grow py-10 px-5 sm:px-10"
                >
                    <section className="flex flex-col items-center justify-center gap-14 w-full h-full">
                        {questions.map((question, i) => (
                            <Fragment key={i}>
                                <Question
                                    number={i + 1}
                                    record={question}
                                    onChange={newQuestion => setQuestions(questions.map((item, questionIdx) => questionIdx === i ? ({ ...item, ...newQuestion }) : item))}
                                />
                                <div
                                    aria-hidden="true"
                                    className="w-full px-14 sm:px-20"
                                >
                                    <hr />
                                </div>
                            </Fragment>
                        ))}
                    </section>
                    <div className="flex items-center justify-center gap-7 w-full">
                        <button
                            type="button"
                            onClick={() => setQuestions([...questions, { ...recordTemplate }])}
                            className="flex items-center justify-center gap-2 py-3 px-7 rounded-lg shadow-md text-white bg-blue-500 hover:bg-blue-600"
                        >
                            <PlusSmIcon className="w-5 h-5 text-white" />
                            Add Question
                        </button>
                        <button
                            type="submit"
                            className="flex items-center justify-center gap-2 py-3 px-7 rounded-lg shadow-md text-white bg-green-500 hover:bg-green-600"
                        >
                            {uploading === true && (
                                <LoadingIcon className="animate-spin w-5 h-5" />
                            )}
                            {success === true && (
                                <CheckIcon className="ww-5 h-5" />
                            )}
                            Save Exam
                        </button>
                    </div>
                </form>
                {exam === undefined && (
                    <ExamModal onSubmit={setExam} />
                )}
            </section>
            <div className="flex flex-col items-center justify-end gap-y-3 p-3 pb-8 fixed right-0 inset-y-0 z-50 h-screen pointer-events-none">
                {notifications.map((notification, idx) => (
                    <Notification
                        {...notification}
                        key={notification.message}
                        removeIcon={() => setNotifications(notifications.filter((_, i) => i !== idx))}
                    />
                ))}
            </div>
        </>
    );
}

export default CreateQuestions;
