import useSWR from "swr";
import Head from "next/head";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useCookies } from "react-cookie";
import { ChevronRightIcon } from "@heroicons/react/solid";
import { FormEvent, FunctionComponent, useMemo, useState } from "react";
import { CheckCircleIcon, ExclamationCircleIcon, XCircleIcon, BellIcon, XIcon } from "@heroicons/react/outline";

import { useNotifications } from "components/Misc/Notification";

import { LoadingIcon } from "components/Misc/Icons";
import { Modal as ExamModal, Question } from "components/Exam";

import type { CreateQuestion } from "types";

const CreateQuestions: NextPage = () => {
    const [addNotification, , Notifications] = useNotifications();

    const router = useRouter();
    const [{ savedExams }, setCookies] = useCookies(['savedExams']);

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
    const [instructions, setInstructions] = useState(['Answer all questions', '']);

    const [examState, setExamState] = useState({ saved: false, uploaded: false, uploading: false });

    function saveExam(obj?: { [key: string]: any }) {
        if (exam !== undefined) {
            setCookies('savedExams', JSON.stringify(obj ?? {
                ...(savedExams ?? {}),
                [exam.details.SubjectID]: {
                    exam,
                    questions,
                    lastSaved: new Date().toISOString()
                }
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
            setExamState({ ...examState, uploading: true });

            try {
                const res = await fetch('/api/exams/', {
                    method: "POST",
                    body: JSON.stringify({
                        questions,
                        exam: exam.details,
                    })
                });

                const { success, error } = await res.json();

                setExamState({ ...examState, uploaded: success });

                if (success === true) {
                    setTimeout(router.reload, 35e2);
                    setNotifications([...notifications, {
                        message: "Upload Success... Reloading",
                        timeout: 3e3,
                        Icon: () => CheckCircleIcon({ className: "w-6 h-6 text-green-700" }),
                    }]);
                    if (savedExams !== undefined) saveExam(Object.fromEntries(Object.entries(savedExams ?? {}).filter(([key]) => key !== exam.details.SubjectID)));
                } else throw new Error(error);
            } catch (error: any) {
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
                }, {
                    message: error.message,
                    timeout: 5e3,
                    Icon: () => ExclamationCircleIcon({ className: "w-6 h-6 text-red-700" })
                }]);
            }

            setExamState({ ...examState, uploading: false });
        }
    }

    function questionActions(pos: number, count: 1 | 0 = 0, data?: CreateQuestion) {
        const items: any[] = [...questions];
        const replace = count === 0 ? { ...recordTemplate } : data;
        items.splice(pos, count, replace);
        setQuestions(items.filter(Boolean));
    }

    return (
        <>
            <Head>
                <title>Create Exam | CBT | Grand Regal School</title>
                <meta name="description" content="Exam Registration | GRS CBT" />
            </Head>
            <form
                onSubmit={handleSubmit}
                className="flex flex-col items-center justify-start w-screen"
            >
                <Bar
                    exam={exam}
                    {...examState}
                    save={saveExam}
                />
                <section className="w-full flex-grow py-10 px-10 bg-indigo-100">
                    <div className="m-auto max-w-3xl h-full space-y-5">
                        <div className="w-full pt-6 pb-5 px-10 flex flex-col gap-3 bg-white rounded-xl shadow-sm">
                            <ul className="mt-3">
                                <div className="text-sm text-gray-800 mb-2 relative w-max after:absolute after:-bottom-0 after:left-0 after:w-full after:border-b after:border-gray-500">
                                    Instructions
                                </div>
                                {instructions.map((instruction, idx) => (
                                    <li
                                        key={idx}
                                        className="flex gap-3 justify-start items-end relative text-sm group mb-2"
                                    >
                                        <span className="text-xs font-semibold -ml-4 text-gray-500">
                                            {idx + 1}.
                                        </span>
                                        <div className="flex-grow h-full relative">
                                            <input
                                                type="text"
                                                value={instruction}
                                                placeholder="Add Instruction"
                                                id={`${instruction}-${idx + 1}`}
                                                className="pt-1.5 pb-0.5 px-3 w-full focus:outline-none"
                                                onChange={({ target: { value } }) => {
                                                    const v = instructions.map((j, i) => i === idx ? value : j).filter(Boolean);
                                                    v.at(-1) !== '' && v.push('');
                                                    setInstructions(v);
                                                }}
                                            />
                                            <label
                                                htmlFor={`${instruction}-${idx + 1}`}
                                                className="absolute left-2.5 bottom-0 w-full border-b border-gray-400 border-dotted group-focus-within:border-gray-500"
                                            />
                                        </div>
                                        {idx > 0 && instructions.length > 2 && (
                                            <span
                                                onClick={() => setInstructions(instructions.filter((_, i) => i !== idx))}
                                                className="w-7 h-7 p-1.5 ml-5 rounded-full cursor-pointer text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                                            >
                                                <XIcon className="w-full h-full" />
                                            </span>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        {questions.map((question, i) => (
                            <Question
                                key={i}
                                number={i + 1}
                                record={question}
                                insertQuestionAbove={() => questionActions(i)}
                                insertQuestionBelow={() => questionActions(i + 1)}
                                deleteQuestion={() => questions.length > 1 && questionActions(i, 1)}
                                onChange={newQuestion => questionActions(i, 1, { ...question, ...newQuestion })}
                            />
                        ))}
                    </div>
                </section>
                <Bar
                    exam={exam}
                    {...examState}
                    save={saveExam}
                />
            </form>
            {exam === undefined && (
                <ExamModal onSubmit={setExam} />
            )}
            <Notifications />
        </>
    );
}

const Bar: FunctionComponent<BarProps> = ({ exam, save, saved, uploading, uploaded }) => {
    const { data: currentSession } = useSWR('/api/sessions/current/', url => fetch(url).then(res => res.json()));

    return (
        <div className="flex items-center justify-end gap-6 w-full bg-white py-5 px-8 sticky left-0 top-0 rounded-b-lg drop-shadow-sm">
            <div className="hidden md:flex items-center justify-start gap-2 flex-grow text-gray-400 w-full text-sm font-medium">
                <span className="w-max block truncate">
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
                <span className="w-max block truncate">{exam?.class ?? "Select Class"}</span>
                <ChevronRightIcon className="w-5 h-5 text-gray-500" />
                <span className="w-max block truncate">{exam?.subject ?? "Select Subject"}</span>
                <ChevronRightIcon className="w-5 h-5 text-gray-500" />
                <span className="text-gray-600">Questions</span>
            </div>
            <button
                type="button"
                onClick={() => save()}
                className="flex items-center justify-center gap-2 py-3 px-8 tracking-wider text-xs font-medium bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-md shadow-sm"
            >
                {saved === true && (
                    <CheckIcon className="w-5 h-5" />
                )}
                Save
            </button>
            <button
                type="submit"
                className="flex items-center justify-center gap-2 py-3 px-8 tracking-wider text-xs font-medium bg-indigo-500 hover:bg-indigo-600 text-white rounded-md shadow-sm"
            >
                {uploading === true && (
                    <LoadingIcon className="animate-spin w-5 h-5" />
                )}
                {uploaded === true && (
                    <CheckIcon className="w-5 h-5" />
                )}
                Submit
            </button>
        </div>
    );
}

type BarProps = {
    save(): void;
    saved: boolean;
    uploaded: boolean;
    uploading: boolean;
    exam?: { class: string; subject: string };
}

export default CreateQuestions;
