import { NextPage } from "next";
import { FormEvent, Fragment, useMemo, useState } from "react";
import { ChevronRightIcon, PlusSmIcon } from "@heroicons/react/solid";

import Question from "components/Question";
import { LoadingIcon } from "components/CustomIcons";

import type { QuestionRecord } from "db/models/Question";

export type RawQuestion = Omit<QuestionRecord<true>, '_id' | 'answers'> & {
    answers: Omit<NonNullable<QuestionRecord<true>['answers']>[number], '_id'>[];
};

const CreateQuestions: NextPage = () => {
    const recordTemplate = useMemo<RawQuestion>(() => ({
        question: "",
        type: "Multiple choice",
        answers: [{ answer: "", isCorrect: true }, { answer: "" }],
        max: undefined,
        min: undefined,
        minLength: undefined,
        maxLength: undefined
    }), []);
    const [uploading, setUploading] = useState(false);
    const [exam, setExam] = useState<{class: string; subject: string; details: Omit<ExamRecord, 'questions'>;}>();
    const [questions, setQuestions] = useState<RawQuestion[]>([{ ...recordTemplate }]);
    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setUploading(true);

        try {
            const res = await fetch('/api/exam', {
                method: "POST",
                body: JSON.stringify({
                    questions,
                    exam: cookie.lastSavedExam,
                })
            });

            const { success, data, message, error } = await res.json();

            if (success === true) {
                console.log({ message, data })
            } else throw new Error(error);
        } catch (error) {
            console.error(error);
        }

        setUploading(false);
    }

    return (
        <section className="flex flex-col items-center justify-center gap-2 w-screen">
            <div className="flex items-center justify-start gap-2 text-gray-400 pt-7 pb-2 px-10 w-full text-sm font-medium">
                <span>2021/2022 Third Term</span>
                <ChevronRightIcon className="w-5 h-5 text-gray-500" />
                <span>{exam?.class ?? "Select Class"}</span>
                <ChevronRightIcon className="w-5 h-5 text-gray-500" />
                <span>{exam?.subject ?? "Select Subject"}</span>
                <ChevronRightIcon className="w-5 h-5 text-gray-500" />
                <span className="text-gray-600">Questions</span>
            </div>
            <form
                onSubmit={handleSubmit}
                className="flex flex-col items-center justify-start gap-10 w-full flex-grow p-10"
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
                                className="w-full px-20"
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
                        Save Exam
                    </button>
                </div>
            </form>
            {exam === undefined && (
                <ExamModal onSubmit={setExam} />
            )}
        </section>
    );
}

export default CreateQuestions;
