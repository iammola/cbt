import useSWR from "swr";
import { compareAsc } from "date-fns";
import { useCookies } from "react-cookie";

import EmptyPage from "./Empty";
import ErrorPage from "./Error";
import { ScoreCard, Cards, Section, Title } from "./Section";

import type { RouteData } from "types";
import type { StudentCBTResultsGETData } from "types/api";

const Result: React.FC = () => {
  const [{ account }] = useCookies(["account"]);
  const { data: { data } = {}, error } = useSWR<RouteData<StudentCBTResultsGETData>>(
    `/api/students/${account?._id}/cbt_results/`
  );

  return (
    <Section>
      <Title>Results</Title>
      <Cards>
        {data
          ?.sort((a, b) => compareAsc(new Date(a.date), new Date(b.date)))
          .map((item, idx) => (
            <ScoreCard
              key={idx}
              {...item}
              date={new Date(item.date)}
              className="flex w-[300px] flex-col items-start justify-start rounded-xl bg-white px-5 py-4 shadow h-48 gap-y-3"
            />
          ))}
        {data && !data.length && <EmptyPage message="No results to see" />}
        {error && <ErrorPage message="Error loading results!!! Retrying..." />}
        {!data?.length && new Array(4).fill(0).map((_, i) => <Skeleton key={i} />)}
      </Cards>
    </Section>
  );
};

const Skeleton: React.FC = () => {
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
