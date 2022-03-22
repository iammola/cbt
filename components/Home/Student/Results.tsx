import useSWR from "swr";
import { FunctionComponent } from "react";
import { useCookies } from "react-cookie";

import { Card, Cards, Section, Title } from "./Section";

import type { RouteData } from "types";
import type { StudentCBTResultsGETData } from "types/api";

const Result: FunctionComponent = () => {
  const [{ account }] = useCookies(["account"]);
  const { data: { data } = {}, error } = useSWR<RouteData<StudentCBTResultsGETData>>(
    `/api/students/${account._id}/cbt_results/`
  );

  return (
    <Section>
      <Title>Results</Title>
      <Cards>
        {data?.map((item, idx) => (
          <Card
            key={idx}
            className="h-48 gap-y-3"
          >
            <h5 className="text-4xl font-bold tracking-wide text-gray-700">{item.score}</h5>
            <h6 className="text-lg font-medium text-gray-600 line-clamp-2">{item.subject}</h6>
            <ul className="w-full list-inside list-disc space-y-1">
              <li className="text-sm text-slate-500">
                Spent <span className="font-medium text-slate-700">{item.time}</span> minute{item.time !== 1 && "s"}
              </li>
              <li className="text-sm text-slate-500">
                Attempted <span className="font-medium text-slate-700">{item.attempts}</span> question
                {item.attempts !== 1 && "s"}
              </li>
            </ul>
          </Card>
        ))}
        {!data && !error && new Array(4).fill(0).map((_, i) => <Skeleton key={i} />)}
      </Cards>
    </Section>
  );
};

const Skeleton: FunctionComponent = () => {
  return (
    <aside className="w-[300px] space-y-5 rounded-xl bg-white px-5 py-4 shadow">
      <div className="h-4 w-full animate-pulse rounded-full bg-slate-300" />
      <div className="h-3 w-full animate-pulse rounded-full bg-slate-300" />
      <div className="w-full space-y-2">
        <div className="h-2 w-2/5 animate-pulse rounded-full bg-slate-300" />
        <div className="h-2 w-3/5 animate-pulse rounded-full bg-slate-300" />
      </div>
    </aside>
  );
};

export default Result;
