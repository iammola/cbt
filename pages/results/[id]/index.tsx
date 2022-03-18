import Head from "next/head";
import Image from "next/image";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWRImmutable from "swr/immutable";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/outline";

import { classNames } from "utils";
import { Divide } from "components/Misc";
import { Header, Info, GradingScheme, ResultFields } from "components/Result";

import type { TermGetData } from "types/api/sessions";
import type { ClassGETData, ClassResultGETData, ClassResultSettingsGETData } from "types/api/classes";
import type { StudentGETData, StudentResultGETData, StudentSubjectsGETData } from "types/api/students";
import type {
  ClassRecord,
  ClientResponse,
  ResultRecord,
  RouteData,
  SessionRecord,
  StudentRecord,
  SubjectRecord,
  TermRecord,
} from "types";
import { LoadingIcon } from "components/Misc/Icons";

const Result: NextPage = () => {
  const router = useRouter();
  const [average, setAverage] = useState(0);
  const [errors, setErrors] = useState<(keyof Data)[]>([]);
  const [total, setTotal] = useState<{ subject: any; total: number }[]>();
  const [data, setData] = useState<Data>({
    term: undefined,
    student: undefined,
  });

  const { data: selectedTerm, error: termError } = useSWRImmutable<RouteData<TermGetData>>(
    `/api/terms/${router.query.term ?? "current"}/`,
    (url) => fetch(url ?? "").then((res) => res.json())
  );
  const { data: student, error: studentError } = useSWRImmutable<RouteData<StudentGETData>>(
    router.query.id !== undefined ? `/api/students/${router.query.id}/` : null,
    (url) => fetch(url ?? "").then((res) => res.json())
  );

  useEffect(() => {
    if (selectedTerm?.data != undefined && data.session === undefined) {
      const { session, ...term } = selectedTerm.data;
      setData((data) => ({ ...data, session, term }));
    }

    if (termError) setErrors((errors) => [...errors, "term", "session"]);
  }, [data, selectedTerm, termError]);

  useEffect(() => {
    async function getClass(id: any) {
      try {
        const res = await fetch(`/api/classes/${id}/?select=name`);
        const result = (await res.json()) as ClientResponse<ClassGETData>;

        if (result.success) {
          if (result.data !== null)
            setData((data) => ({
              ...data,
              stats: undefined,
              class: result.data!,
            }));
          else alert("Class does not exist");
        } else throw new Error(result.error);
      } catch (error: any) {
        console.error({ error });
        setErrors((errors) => [...errors, "class"]);
      }
    }

    if (student?.data != undefined) {
      if (data.student === undefined)
        setData((data) => ({
          ...data,
          class: undefined,
          scores: undefined,
          comments: undefined,
          subjects: undefined,
          student: student.data!,
        }));

      if (data.session !== undefined && data.class === undefined) {
        const { academic } = student.data;
        const { session, term } = data ?? {};
        const active = academic.find((i) => i.session === session?._id)?.terms.find((i) => i.term === term?._id);

        if (active?.class !== undefined && data.class === undefined) getClass(active.class);
      }
    }

    if (studentError) setErrors((errors) => [...errors, "class"]);
  }, [data, student?.data, studentError]);

  useEffect(() => {
    async function getResultTemplate(id: any, term: any) {
      try {
        const res = await fetch(`/api/classes/${id}/results/setting/?term=${term}`);
        const result = (await res.json()) as ClientResponse<ClassResultSettingsGETData>;

        if (result.success)
          setData((data) => ({
            ...data,
            template: result.data,
          }));
        else throw new Error(result.error);
      } catch (error: any) {
        console.error({ error });
        setErrors((errors) => [...errors, "template"]);
      }
    }

    if (selectedTerm && data.class && !data.template) getResultTemplate(data.class?._id, selectedTerm.data._id);
  }, [data.class, data.template, selectedTerm]);

  useEffect(() => {
    async function getSubjects(student: any, term: any) {
      try {
        const res = await fetch(`/api/students/${student}/subjects/?term=${term}`);
        const result = (await res.json()) as ClientResponse<StudentSubjectsGETData>;

        if (result.success)
          setData((data) => ({
            ...data,
            subjects: result.data,
          }));
        else throw new Error(result.error);
      } catch (error: any) {
        console.error({ error });
        setErrors((errors) => [...errors, "subjects"]);
      }
    }

    if (selectedTerm && student?.data && !data.subjects) getSubjects(student.data._id, selectedTerm.data._id);
  }, [data.subjects, selectedTerm, student?.data]);

  useEffect(() => {
    async function getScores(student: any, term: any) {
      try {
        const res = await fetch(`/api/students/${student}/results/?term=${term}`);
        const result = (await res.json()) as ClientResponse<StudentResultGETData>;

        if (result.success) {
          const { data: scores, comments } = result.data;
          setData((data) => ({ ...data, scores, comments }));
          setTotal(
            scores.map((score) => ({
              subject: score.subject,
              total: score.total ?? score.scores?.reduce((a, b) => a + b.score, 0) ?? 0,
            }))
          );
        } else throw new Error(result.error);
      } catch (error) {
        console.error({ error });
        setErrors((errors) => [...errors, "scores", "comments"]);
      }
    }
    if (selectedTerm && student?.data && !data.scores) getScores(student.data._id, selectedTerm.data._id);
  }, [data.scores, selectedTerm, student?.data]);

  useEffect(() => {
    async function getClassStat(id: any, term: any) {
      try {
        const res = await fetch(`/api/classes/${id}/results/stats/?term=${term}`);
        const result = (await res.json()) as ClientResponse<ClassResultGETData>;

        if (result.success) setData((data) => ({ ...data, stats: result.data }));
        else throw new Error(result.error);
      } catch (error) {
        console.error({ error });
        setErrors((errors) => [...errors, "stats"]);
      }
    }
    if (selectedTerm && data.class && !data.stats) getClassStat(data.class._id, selectedTerm.data._id);
  }, [data.class, data.stats, selectedTerm]);

  useEffect(() => {
    if (data.template !== undefined && total !== undefined) {
      const overallTotal = total?.reduce((a, b) => a + b.total, 0) ?? 0;
      const subjectMax = data.template?.fields.reduce((a, b) => a + b.max, 0) ?? 0;
      setAverage((overallTotal / ((data.scores?.length ?? 0) * subjectMax)) * 1e2);
    }
  }, [data.scores, data.template, total]);

  return (
    <section className="flex min-h-screen w-screen items-center justify-center bg-gray-200 py-16 print:bg-white print:p-0">
      <Head>
        <title>
          {data.student?.name.full ?? "Loading student"} Result | {data.term?.name} Term | {data.session?.name} Session
          | Grand Regal School
        </title>
        <meta
          name="description"
          content="Student • Results | GRS CBT"
        />
      </Head>
      <main className="flex aspect-[1/1.4142] w-[60rem] flex-col items-center justify-start rounded-lg bg-white p-12 shadow-xl shadow-gray-500/30 print:rounded-none print:px-8 print:py-5 print:shadow-none">
        <Header />
        <Divide
          className="w-full py-7"
          HRclassName="border-t-gray-300"
        />
        <Info
          term={data.term?.name}
          class={data.class?.name}
          session={data.session?.name}
          gender={data.student?.gender}
          name={data.student?.name.full}
          birthday={data.student?.birthday}
          average={{ ...(data.stats?.average ?? {}), average }}
          scores={{
            total: total?.reduce((a, b) => a + b.total, 0),
            grade: data.template?.scheme.find((scheme) => average <= scheme.limit)?.grade,
            expected: (data.scores?.length ?? 0) * (data.template?.fields.reduce((a, b) => a + b.max, 0) ?? 0),
          }}
        />
        <Divide
          className="w-full py-10"
          HRclassName="border-t-gray-300"
        />
        <table className="min-w-full border-separate overflow-hidden rounded-lg border border-gray-400 bg-white [border-spacing:0;]">
          <thead className="bg-gray-50 text-gray-700">
            <tr className="divide-x divide-gray-400">
              <th
                scope="col"
                className="border-b border-gray-400 py-5"
              >
                <span className="sr-only">Subjects / Fields</span>
              </th>
              {[...(data.template?.fields ?? []), { alias: "Total" }, { alias: "Grade" }].map((field) => (
                <th
                  scope="col"
                  key={field.alias}
                  className="border-b border-gray-400 py-5 font-medium"
                >
                  <span className="px-2 text-xs font-semibold uppercase tracking-wider text-gray-700">
                    {field.alias}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-400 bg-white text-gray-600">
            {data.subjects
              ?.filter((subject) => data.scores?.find((item) => item.subject === subject._id) !== undefined)
              .map((subject, index) => {
                const scores = data.scores?.find((item) => item.subject === subject._id);
                const subjectTotal = total?.find((g) => g.subject === subject._id)?.total ?? 0;
                const scheme = data.template?.scheme.find((i) => subjectTotal <= i.limit);

                return (
                  scores !== undefined && (
                    <tr
                      key={subject.name}
                      className={classNames("divide-x divide-gray-400 text-center text-xs font-medium text-gray-800", {
                        "bg-gray-100": index % 2 === 1,
                      })}
                    >
                      <td className="px-2 py-4 font-normal text-gray-700 print:text-center">{subject.name}</td>
                      {data.template?.fields.map((field) => {
                        const item = scores?.scores?.find((i) => i.fieldId === field._id);

                        return (
                          <td
                            key={field._id.toString()}
                            className="w-16 py-4 print:w-12"
                          >
                            {scores?.total === undefined ? item?.score : "-"}
                          </td>
                        );
                      })}
                      <td className="py-4 px-1">{subjectTotal.toFixed(1)}</td>
                      <td className="py-4 px-1 font-medium">{scheme?.grade}</td>
                    </tr>
                  )
                );
              })}
          </tbody>
        </table>
        <Divide
          className="w-full py-10"
          HRclassName="border-t-gray-300"
        />
        <div className="grid w-full grid-cols-2 items-center justify-between gap-x-20 [grid-template-rows:max-content_1fr]">
          <GradingScheme
            scheme={data.template?.scheme ?? []}
            className="col-start-2 col-end-3 row-start-1 row-end-2"
          />
          <ResultFields
            fields={data.template?.fields ?? []}
            className="col-start-1 col-end-2 row-span-full"
          />
          <div className="col-start-2 col-end-3 row-start-2 row-end-3 mt-3 flex flex-col items-start justify-center gap-0.5">
            {data.comments !== undefined && (
              <>
                <span className="text-sm font-medium text-gray-800 underline underline-offset-2">Comment</span>
                <span className="text-justify text-sm text-gray-700">{data.comments}</span>
              </>
            )}
            <div className="relative mt-8 h-20 w-52 self-center">
              <Image
                priority
                layout="fill"
                alt="VP Signature"
                objectFit="contain"
                src="/Signature VP.png"
                objectPosition="center"
                className="brightness-50"
              />
            </div>
            <span className="mt-2 self-center text-sm font-medium tracking-wide text-gray-600">
              V.P. Academics Signature
            </span>
          </div>
        </div>
      </main>
      {Object.values(data).includes(undefined) && (
        <div className="fixed inset-0 z-[10000] flex h-screen w-screen flex-col items-center justify-center gap-y-10 bg-white text-3xl tracking-wide text-slate-600">
          Loading Result Data...
          <ul className="space-y-3 text-sm">
            {Object.entries(data).map(([key, val]) => (
              <li
                key={key}
                className={classNames("flex items-center justify-start gap-x-4", {
                  "text-emerald-500": val,
                  "text-red-500": errors.includes(key as keyof Data),
                  "text-blue-500": !val && !errors.includes(key as keyof Data),
                })}
              >
                {!val && !errors.includes(key as keyof Data) && (
                  <LoadingIcon className="h-5 w-5 animate-spin stroke-blue-500" />
                )}
                {val && <CheckCircleIcon className="h-5 w-5 stroke-emerald-500" />}
                {errors.includes(key as keyof Data) && <XCircleIcon className="h-5 w-5 stroke-red-500" />}
                <span className="capitalize">{key}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
};

interface Data {
  comments?: ResultRecord["comments"];
  scores?: ResultRecord["data"];
  term?: TermRecord;
  stats?: ClassResultGETData;
  template?: ClassResultSettingsGETData;
  class?: Pick<ClassRecord, "_id" | "name">;
  session?: Pick<SessionRecord, "_id" | "name">;
  subjects?: Pick<SubjectRecord, "_id" | "name">[];
  student?: Pick<StudentRecord, "_id" | "name" | "birthday" | "gender">;
}

export default Result;
