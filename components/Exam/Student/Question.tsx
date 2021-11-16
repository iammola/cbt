import { FunctionComponent } from "react";

import { Answer } from '.';
import type { StudentQuestionProps } from "types";

const Question: FunctionComponent<StudentQuestionProps> = ({ id, chosen, question, answers, onAnswer }) => {
    return (
        <div className="w-full pt-8 pb-3 pr-7 pl-4 bg-white rounded-xl shadow-sm">
            <p className="w-full rounded-t py-3 pl-4 pr-10 text-gray-700 font-medium text-sm">
                {question}
            </p>
            <ul className="flex flex-col items-start justify-start gap-1 w-full mb-5 pl-4">
                {answers.map((answer, answerIdx) => (
                    <li
                        key={answerIdx}
                        className="flex items-center justify-start gap-4 w-full pl-5 rounded-md hover:bg-gray-50"
                    >
                        <Answer
                            {...answer}
                            handleSelect={onAnswer}
                            selected={chosen === answer.id}
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Question;
