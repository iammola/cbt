import { FunctionComponent } from 'react';
import { SortAscendingIcon, SortDescendingIcon, TrashIcon } from '@heroicons/react/outline';

import { Answer } from 'components/Exam';

import type { QuestionProps } from 'types';

const Question: FunctionComponent<QuestionProps> = ({ record, number, onChange, deleteQuestion, insertQuestionBelow, insertQuestionAbove }) => {
    return (
        <div className="w-full pt-8 pb-3 pr-7 pl-4 bg-white rounded-xl shadow-sm">
            <input
                required
                type="text"
                value={record.question}
                placeholder={`Question ${number} `}
                onChange={({ target: { value } }) => onChange({ question: value })}
                className="w-full rounded-t py-3 pl-4 pr-10 text-gray-700 font-medium text-sm border-b-2 border-transparent focus:bg-gray-50 focus:border-b-2 focus:border-indigo-300 focus:outline-none"
            />
            <ul className="flex flex-col items-start justify-start gap-3 w-full my-5 pl-4">
                {record.answers.map((answer, answerIdx) => (
                    <li
                        key={answerIdx}
                        className="flex items-center justify-start gap-4 w-full"
                    >
                        <Answer
                            {...answer}
                            number={answerIdx + 1}
                            id={`${number}${answerIdx}`}
                            deleteAnswer={() => onChange({ answers: record.answers.filter((_, i) => i !== answerIdx) })}
                            handleChange={answer => onChange({
                                answers: record.answers.map((value, idx) => idx === answerIdx ? { ...value, ...answer } : {
                                    ...value,
                                    isCorrect: (answer.isCorrect === true && record.type === "Multiple choice") ? undefined : value.isCorrect
                                })
                            })}
                        />
                    </li>
                ))}
                <button
                    type="button"
                    onClick={() => onChange({ answers: [...record.answers, { answer: "" }] })}
                    className="text-sm text-white py-2 px-4 rounded-md bg-gray-500 hover:bg-gray-600 cursor-pointer focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-white focus:outline-none"
                >
                    Add Option
                </button>
            </ul>
            <div className="flex items-center justify-end gap-3 w-full border-t pl-4 py-1">
                <span
                    onClick={insertQuestionAbove}
                    className="group relative p-2.5 rounded-full cursor-pointer text-gray-700 hover:text-gray-600 hover:bg-gray-100"
                >
                    <SortAscendingIcon className="w-5 h-5" />
                    <span className="hidden group-hover:inline absolute left-1/2 -top-10 -translate-x-1/2 p-2 rounded-md shadow-md text-xs text-gray-600 bg-white w-max">
                        Insert Question Above
                    </span>
                </span>
                <span
                    onClick={insertQuestionBelow}
                    className="group relative p-2.5 rounded-full cursor-pointer text-gray-700 hover:text-gray-600 hover:bg-gray-100"
                >
                    <SortDescendingIcon className="w-5 h-5" />
                    <span className="hidden group-hover:inline absolute left-1/2 -top-10 -translate-x-1/2 p-2 rounded-md shadow-md text-xs text-gray-600 bg-white w-max">
                        Insert Question Below
                    </span>
                </span>
                <span
                    onClick={deleteQuestion}
                    className="group relative p-2.5 rounded-full cursor-pointer text-gray-700 hover:text-gray-600 hover:bg-gray-100"
                >
                    <TrashIcon className="w-5 h-5" />
                    <span className="hidden group-hover:inline absolute left-1/2 -top-10 -translate-x-1/2 p-2 rounded-md shadow-md text-xs text-gray-600 bg-white w-max">
                        Delete Question
                    </span>
                </span>
            </div>
        </div>
    );
}

export default Question;
