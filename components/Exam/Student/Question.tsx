import { FunctionComponent } from "react";

import { Answer } from ".";
import type { StudentQuestionProps } from "types";

const Question: FunctionComponent<StudentQuestionProps> = ({ chosen, question, answers, onAnswer }) => {
  return (
    <div className="w-full rounded-xl bg-white pt-8 pb-3 pr-7 pl-4 shadow-sm">
      <p className="w-full rounded-t py-3 pl-4 pr-10 text-sm font-medium text-gray-700">{question}</p>
      <ul className="mb-5 flex w-full flex-col items-start justify-start gap-1 pl-4">
        {answers.map((answer, answerIdx) => (
          <li
            key={answerIdx}
            className="flex w-full items-center justify-start gap-4 rounded-md pl-5 hover:bg-gray-50"
          >
            <Answer
              {...answer}
              handleSelect={onAnswer}
              selected={chosen === answer._id.toString()}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Question;
