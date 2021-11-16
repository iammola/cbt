import Head from "next/head";
import { NextPage } from "next";
import { useState } from "react";

import { Grid, Timer, Question } from "components/Exam/Student";

const WriteExam: NextPage = () => {
    const questions = [{
        id: "Question1",
        question: "How many goals has Trent Alexander-Arnold assisted for Liverpool Football Club?",
        answers: [{
            id: "Option1",
            answer: "None"
        }]
    }];
    const [answeredQuestions, setAnsweredQuestions] = useState<{ [QuestionId: string]: string }>({});

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
                <div className="flex items-center justify-end gap-6 w-full bg-white py-3 px-8 rounded-b-lg drop-shadow-sm">
                    <div className="hidden md:flex items-center justify-start gap-2 flex-grow text-gray-400 w-full text-sm font-medium">
                        <span className="w-max block truncate">
                            Session
                        </span>
                        {' • '}
                        <span className="w-max block truncate">
                            Class
                        </span>
                        {' • '}
                        <span className="w-max block truncate">
                            Subject
                        </span>
                        {' • '}
                        <span className="text-gray-600">
                            Name
                        </span>
                    </div>
                    <button
                        type="submit"
                        className="flex items-center justify-center gap-2 py-3 px-8 tracking-wider text-xs font-medium bg-indigo-500 hover:bg-indigo-600 text-white rounded-md shadow-sm"
                    >
                        Submit
                    </button>
                </div>
                <div className="flex flex-grow gap-6 items-center justify-center w-full h-full pt-6 px-12 bg-gray-50">
                    <div className="flex flex-col items-start justify-start h-full w-[18rem] py-8">
                        <Grid
                            questions={questions.map(({ id }) => ({
                                answered: !!answeredQuestions[id],
                            }))}
                        />
                    </div>
                    <div className="flex-grow h-full py-8">
                        <div className="m-auto max-w-4xl h-full space-y-5">
                            {questions.map((question, questionIdx) => (
                                <Question
                                    {...question}
                                    key={questionIdx}
                                    chosen={answeredQuestions[question.id]}
                                    onAnswer={AnswerID => setAnsweredQuestions({
                                        ...answeredQuestions,
                                        [question.id]: AnswerID
                                    })}
                                />
                            ))}
                        </div>
                    </div>
                </div>
                <Timer timeout={30000} />
            </form>
        </>
    );
}

export default WriteExam;
