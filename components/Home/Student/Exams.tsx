import { FunctionComponent } from "react";

import { Card, Cards, Section, Title } from "./Section";

const Exam: FunctionComponent = () => {
  return (
    <Section>
      <Title>Exams</Title>
      <Cards>
        <Card>
          <h5 className="text-2xl font-bold text-gray-700 line-clamp-2">Information and Communication Technology</h5>
          <ul className="w-full list-inside list-disc space-y-1">
            <li className="text-sm text-slate-700">
              <span className="font-medium">50</span> questions
            </li>
            <li className="text-sm text-slate-700">
              <span className="font-medium">60</span> minutes
            </li>
            <li className="text-sm font-medium text-slate-700">Wednesday, 23rd March 2022</li>
          </ul>
          <button
            type="button"
            className="w-full cursor-pointer rounded-full bg-blue-500 py-2 px-8 text-sm text-white hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            Start Exam
          </button>
        </Card>
      </Cards>
    </Section>
  );
};

export default Exam;
