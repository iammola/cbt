import { FunctionComponent } from "react";

import { Card, Cards, Section, Title } from "./Section";

const Result: FunctionComponent = () => {
  return (
    <Section>
      <Title>Results</Title>
      <Cards>
        <Card className="h-48 gap-y-3">
          <h5 className="text-4xl font-bold tracking-wide text-gray-700">41</h5>
          <h6 className="text-lg font-medium text-gray-600 line-clamp-2">Information and Communication Technology</h6>
          <ul className="w-full list-inside list-disc space-y-1">
            <li className="text-sm text-slate-500">
              Spent <span className="font-medium text-slate-700">30</span> minutes
            </li>
            <li className="text-sm text-slate-500">
              Answered <span className="font-medium text-slate-700">50</span> questions
            </li>
          </ul>
        </Card>
      </Cards>
    </Section>
  );
};

export default Result;
