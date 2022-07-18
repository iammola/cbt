import useSWR from "swr";
import { useCookies } from "react-cookie";
import { compareAsc } from "date-fns";

import ErrorPage from "./Error";
import EmptyPage from "./Empty";
import { ExamCard, Cards, Section, Title } from "./Section";

import type { RouteData } from "types";
import type { StudentExamsGETData } from "types/api";

const Exam: React.FC = () => {
  const [{ account }] = useCookies(["account"]);
  const { data: { data } = {}, error } = useSWR<RouteData<StudentExamsGETData>>(`/api/students/${account?._id}/exams/`);

  return (
    <Section>
      <Title>Scheduled Exams</Title>
      <Cards>
        {data
          ?.sort((a, b) => compareAsc(new Date(a.date), new Date(b.date)))
          .map((item) => (
            <ExamCard
              {...item}
              key={item._id.toString()}
              date={new Date(item.date)}
              className="flex w-[300px] flex-col items-start rounded-xl bg-white px-5 py-4 shadow h-64 justify-between gap-y-5"
            />
          ))}
        {data && !data.length && <EmptyPage message="No exams to write" />}
        {error && <ErrorPage message="Error loading exams!!! Retrying..." />}
        {!data?.length && new Array(4).fill(0).map((_, i) => <Skeleton key={i} />)}
      </Cards>
    </Section>
  );
};

const Skeleton: React.FC = () => {
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
