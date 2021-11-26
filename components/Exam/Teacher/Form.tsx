import { useRouter } from "next/router";
import { useCookies } from "react-cookie";
import { FormEvent, FunctionComponent, useEffect, useMemo, useState } from "react";
import { CogIcon, CheckCircleIcon, ExclamationCircleIcon, XCircleIcon, BellIcon, XIcon, ArrowSmUpIcon } from "@heroicons/react/outline";

import { Bar, Modal, Question } from ".";
import { useNotifications } from "components/Misc/Notification";

import type { CreateQuestion } from "types";
import type { ExamGETData } from "types/api/exams";

const Form: FunctionComponent<{ data?: ExamGETData; }> = ({ data }) => {
    const router = useRouter();
    const [addNotification, , Notifications] = useNotifications();
    const [{ savedExams }, setCookies] = useCookies(['savedExams']);

    const recordTemplate = useMemo<CreateQuestion>(() => ({
        question: "",
        type: "Multiple choice",
        answers: [{ answer: "", isCorrect: true }, { answer: "" }],
    }), []);
    const [exam, setExam] = useState<Omit<ExamGETData['details'], 'instructions'>>();
    const [questions, setQuestions] = useState<CreateQuestion[]>([{ ...recordTemplate }]);
    const [instructions, setInstructions] = useState(['Answer all questions', '']);

    const [examState, setExamState] = useState({ details: true, modified: false, saved: false, uploaded: false, uploading: false });

    useEffect(() => {
        if (data !== undefined) {
            const { questions, details: { instructions, ...details } } = data;
            setExam(details);
            setQuestions(questions);
            setInstructions([...instructions, '']);
        }
    }, [data]);

    function saveExam(obj?: { [key: string]: any }) {
        if (exam !== undefined && examState.modified === true) {
            setCookies('savedExams', JSON.stringify(obj ?? {
                ...(savedExams ?? {}),
                [exam.subjectId as unknown as string]: {
                    exam,
                    questions,
                    lastSaved: new Date().toISOString()
                }
            }), {
                path: '/',
                sameSite: true,
                expires: new Date('2038-01-19')
            });
            if (obj === undefined) addNotification({
                message: "Saved Locally",
                timeout: 3e3,
                Icon: () => BellIcon({ className: "w-6 h-6 stroke-blue-700" })
            });
            setExamState({ ...examState, modified: false, saved: true });
        }
    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (exam !== undefined) {
            setExamState({ ...examState, uploading: true });

            try {
                const { name, ...details } = exam;
                const [url, method] = data?._id === undefined ? ["/api/exams/", "POST"] : [`/api/exams/${data._id}/`, "PUT"];
                const res = await fetch(url, {
                    method,
                    body: JSON.stringify({
                        questions,
                        exam: {
                            ...details,
                            instructions: instructions.filter(Boolean)
                        }
                    })
                });

                const { success, error } = await res.json();

                setExamState({ ...examState, uploaded: success });

                if (success === true) {
                    setTimeout(router.reload, 35e2);
                    addNotification({
                        message: "Upload Success... Reloading",
                        timeout: 3e3,
                        Icon: () => CheckCircleIcon({ className: "w-6 h-6 stroke-emerald-700" }),
                    });
                    if (savedExams !== undefined) saveExam(
                        Object.fromEntries(
                            Object.entries(savedExams ?? {}).filter(
                                ([key]) => key !== exam.subjectId.toString()
                            )
                        )
                    );
                } else throw new Error(error);
            } catch (error: any) {
                setTimeout(saveExam, 5e2);
                addNotification({
                    message: "Upload Failed... Try again",
                    timeout: 5e3,
                    Icon: () => XCircleIcon({ className: "w-6 h-6 stroke-red-700" }),
                });
                setTimeout(addNotification, 1e3, {
                    message: error.message,
                    timeout: 5e3,
                    Icon: () => ExclamationCircleIcon({ className: "w-6 h-6 stroke-red-700" })
                });
                console.error(error);
            }

            setExamState({ ...examState, uploading: false });
        }
    }

    function questionActions(pos: number, count: 1 | 0 = 0, data?: CreateQuestion) {
        const items: any[] = [...questions];
        const replace = count === 0 ? { ...recordTemplate } : data;
        items.splice(pos, count, replace);
        setQuestions(items.filter(Boolean));
        setExamState({ ...examState, saved: false, modified: true });
    }

    return (
        <>
            <form
                onSubmit={handleSubmit}
                className="flex flex-col items-center justify-start w-screen"
            >
                <Bar
                    exam={exam?.name}
                    {...examState}
                    save={saveExam}
                />
                <section className="w-full grow py-10 px-10 bg-indigo-100 relative">
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
                                        <div className="grow h-full relative">
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
                                                className="w-7 h-7 p-1.5 ml-5 rounded-full cursor-pointer hover:bg-gray-100"
                                            >
                                                <XIcon className="w-full h-full fill-gray-500 hover:fill-gray-700" />
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
                    <div
                        onClick={() => setExamState({ ...examState, details: false })}
                        className="fixed right-4 top-24 rounded-full p-2 bg-white cursor-pointer group"
                    >
                        <CogIcon className="w-6 h-6 stroke-indigo-700" />
                        <span className="hidden group-hover:inline absolute -left-4 -top-10 -translate-x-1/2 p-2 rounded-md shadow-md text-xs text-gray-600 bg-white w-max">
                            Change Settings
                        </span>
                    </div>
                    <div
                        onClick={() => scrollTo({ behavior: "smooth", top: 0 })}
                        className="fixed right-4 bottom-24 rounded-full p-2 bg-white cursor-pointer group"
                    >
                        <ArrowSmUpIcon className="w-6 h-6 stroke-indigo-700" />
                        <span className="hidden group-hover:inline absolute -left-4 -top-10 -translate-x-1/2 p-2 rounded-md shadow-md text-xs text-gray-600 bg-white w-max">
                            Scroll to Top
                        </span>
                    </div>
                </section>
                <Bar
                    exam={exam?.name}
                    {...examState}
                    save={saveExam}
                />
            </form>
            <Modal
                onSubmit={d => {
                    setExam(d);
                    setExamState({ ...examState, details: true });
                }}
                isEdit={!!router.query.id}
                open={exam === undefined || examState.details === false}
            />
            {Notifications}
        </>
    );
}

export default Form;
