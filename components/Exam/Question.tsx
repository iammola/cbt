import { FunctionComponent, useState, useMemo } from 'react';
import { PlusSmIcon } from '@heroicons/react/outline';

import Select from 'components/Select';
import Answer from 'components/Exam/Answer';
import { CircleIcon, LineIcon } from 'components/Misc/Icons';

import type { QuestionRecord, QuestionProps } from 'types';

const Question: FunctionComponent<QuestionProps> = ({ record, number, onChange }) => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const questionTypes = useMemo(() => [{
        _id: "Multiple choice",
        name: "Multiple Choice Single Answer"
    }, {
        _id: "Checkboxes",
        name: "Multiple Choice Multiple Answer"
    }, {
        _id: "Short Answer",
        name: "Short Answer"
    }, {
        _id: "Long Answer",
        name: "Long Answer"
    }], []);

    const [questionType, setQuestionType] = useState(questionTypes.find(({ _id }) => _id === record.type) ?? questionTypes[0]);

    const addOption = () => onChange({ answers: [...record.answers, { answer: "" }] });

    const removeOption = (optionIdx: number) => onChange({ answers: record.answers.filter((_, i) => i !== optionIdx) });

    function changeType(type: QuestionRecord['type']) {
        setQuestionType(questionTypes.find(({ _id }) => _id === type) ?? questionTypes[0]);

        const { question, answers } = record;
        const newRecord = {
            type,
            question,
            max: undefined,
            min: undefined,
            answers: undefined,
            maxLength: undefined,
            minLength: undefined,
        };

        if (type === "Multiple choice") onChange({
            ...newRecord,
            answers,
        });

        if (type === "Checkboxes") onChange({
            ...newRecord,
            min: 1,
            answers,
            max: answers.filter(({ isCorrect }) => isCorrect).length,
        });
    }

    return (
        <section className="flex flex-col gap-12 w-full">
            <span className="text-2xl text-center pl-10 flex-grow font-medium">
                Question {number}
            </span>
            <div className="flex flex-col gap-14 sm:gap-20 w-full relative">
                <div className="flex flex-col lg:flex-row items-start gap-y-4 lg:gap-y-0 gap-x-0 lg:gap-x-6 pl-[34px]">
                    <span className="absolute left-0 z-0 flex flex-col items-center justify-start w-[22px] h-[calc(100%+2px)] pt-1.5">
                        <CircleIcon className="drop-shadow-2xl text-gray-600 flex-shrink-0" />
                        <LineIcon className="flex-grow text-gray-600 -mt-1" />
                    </span>
                    <span className="w-max font-medium">
                        {/* Choose  */}Question Type:
                    </span>
                    <Select
                        className="-mt-5"
                        selected={questionType}
                        options={questionTypes}
                        handleChange={({ _id }) => changeType(_id)}
                    />
                </div>
                <div className="flex flex-col items-start gap-6 pl-[34px]">
                    <span className="absolute left-0 z-0 flex flex-col items-center justify-start w-[22px] h-[calc(100%+2px)] pt-2">
                        <CircleIcon className="drop-shadow-2xl text-gray-600 flex-shrink-0" />
                    </span>
                    <span className="w-max font-medium">
                        Question:
                    </span>
                    <div className="flex flex-col items-start justify-start gap-7 w-full">
                        <input
                            required
                            type="text"
                            value={record.question}
                            onChange={({ target: { value } }) => onChange({ question: value })}
                            className="w-full border rounded-lg transition-shadow focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 focus:ring-offset-white focus:outline-none py-4 pl-8 pr-10"
                        />
                        <ul className="flex flex-col items-start justify-start gap-5 w-full pl-6 pr-4 md:pr-8 xl:pr-14 2xl:pr-20">
                            {record.answers.map((answer, answerIdx) => (
                                <li
                                    key={answerIdx}
                                    className="flex items-center justify-start gap-4 w-full"
                                >
                                    <Answer
                                        {...answer}
                                        letter={letters[answerIdx]}
                                        id={`${number}${letters[answerIdx]}`}
                                        deleteOption={() => removeOption(answerIdx)}
                                        handleChange={answer => onChange({
                                            answers: record.answers.map((value, idx) => idx === answerIdx ? { ...value, ...answer } : {
                                                ...value,
                                                isCorrect: (answer.isCorrect === true && questionType._id === "Multiple choice") ? false : value.isCorrect
                                            })
                                        })}
                                    />
                                </li>
                            ))}
                        </ul>
                        <button
                            type="button"
                            onClick={addOption}
                            className="flex items-center gap-5 ml-10 py-3 px-4 rounded-md transition-shadow hover:ring-2 hover:ring-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <span className="p-2 rounded-full bg-blue-600">
                                <PlusSmIcon className="w-5 h-5 text-white" />
                            </span>
                            Add Option
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Question;
