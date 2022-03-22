import { FunctionComponent } from "react";

import { Card, Cards, Section, Title } from "./Section";

const Exam: FunctionComponent = () => {
  return (
    <Section>
      <Title>Scheduled Exams</Title>
      <Cards>
        {new Array(4).fill(0).map((_, i) => (
          <Skeleton key={i} />
        ))}
      </Cards>
    </Section>
  );
};

const Skeleton: FunctionComponent = () => {
  return (
    <aside className="w-[300px] space-y-5 rounded-xl bg-white px-5 py-4 shadow">
      <div className="h-4 w-full animate-pulse rounded-full bg-slate-300" />
      <div className="w-full space-y-2">
        <div className="h-2 w-2/5 animate-pulse rounded-full bg-slate-300" />
        <div className="h-2 w-3/5 animate-pulse rounded-full bg-slate-300" />
        <div className="h-2 w-4/5 animate-pulse rounded-full bg-slate-300" />
      </div>
      <div className="w-full animate-pulse rounded-full bg-slate-300 py-2" />
    </aside>
  );
};

export default Exam;
