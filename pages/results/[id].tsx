import Head from "next/head";
import Image from "next/image";
import { format } from "date-fns";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWRImmutable from "swr/immutable";

import { classNames } from "utils";
import { Divide } from "components/Misc";
import { GradingScheme, ResultFields } from "components/Result";

import type { ClassGETData, ClassResultSettingsGETData } from "types/api/classes";
import type { StudentGETData, StudentResultGETData, StudentSubjectsGETData } from "types/api/students";
import type { SessionCurrentGETData } from "types/api/sessions";
import type { ClassRecord, ClientResponse, ResultRecord, RouteData, SessionRecord, StudentRecord, SubjectRecord, TermRecord } from "types";

const Result: NextPage = () => {
    const router = useRouter();
    const [total, setTotal] = useState<{ subject: any; total: number }[]>();
    const [data, setData] = useState<Partial<Data>>();

    const { data: session } = useSWRImmutable<RouteData<SessionCurrentGETData>>(`/api/sessions/current/`, url => fetch(url ?? '').then(res => res.json()));
    const { data: student } = useSWRImmutable<RouteData<StudentGETData>>(router.query.id !== undefined ? `/api/students/${router.query.id}/` : null, url => fetch(url ?? '').then(res => res.json()));

    useEffect(() => {
        if (session?.data != undefined && data?.session === undefined) {
            const { _id, name, terms } = session.data;

            setData(data => ({
                ...data,
                session: { _id, name },
                term: terms.find(term => term.current === true),
            }));
        }
    }, [data, session]);

    useEffect(() => {
        async function getClass(id: any) {
            try {
                const res = await fetch(`/api/classes/${id}/?select=name`);
                const result = await res.json() as ClientResponse<ClassGETData>;

                if (result.success === true) {
                    if (result.data !== null) setData(data => ({
                        ...data,
                        class: result.data!
                    })); else alert("Class does not exist");
                } else throw new Error(result.error);
            } catch (error: any) {
                console.error({ error });
            }
        }

        if (student?.data != undefined) {
            if (data?.student === undefined) setData(data => ({
                ...data,
                student: student.data!,
            }));

            if (data?.session !== undefined && data?.class === undefined) {
                const { academic } = student.data;
                const { session, term } = data ?? {};
                const active = academic.find(i => i.session === session?._id)?.terms.find(i => i.term === term?._id);

                if (active?.class !== undefined && data.class === undefined) getClass(active.class);
            }

        }
    }, [data, student?.data]);

    useEffect(() => {
        async function getResultTemplate(id: any) {
            try {
                const res = await fetch(`/api/classes/${id}/results/setting/`);
                const result = await res.json() as ClientResponse<ClassResultSettingsGETData>;

                if (result.success === true) setData(data => ({
                    ...data,
                    template: result.data
                })); else throw new Error(result.error);
            } catch (error: any) {
                console.error({ error });
            }
        }

        if (data?.class !== undefined && data.template === undefined) getResultTemplate(data.class?._id);
    }, [data?.class, data?.template]);

    useEffect(() => {
        async function getSubjects(student: any) {
            try {
                const res = await fetch(`/api/students/${student}/subjects/`);
                const result = await res.json() as ClientResponse<StudentSubjectsGETData>;

                if (result.success === true) setData(data => ({
                    ...data,
                    subjects: result.data
                })); else throw new Error(result.error);
            } catch (error: any) {
                console.error({ error });
            }
        }

        if (student?.data != undefined && data?.subjects === undefined) getSubjects(student.data._id);
    }, [data?.subjects, student?.data]);

    useEffect(() => {
        async function getScores(student: any) {
            try {
                const res = await fetch(`/api/students/${student}/results/`);
                const result = await res.json() as ClientResponse<StudentResultGETData>;

                if (result.success === true) {
                    const { data: scores, comments } = result.data;
                    setData(data => ({ ...data, scores, comments }));
                    setTotal(scores.map(score => ({
                        subject: score.subject,
                        total: (score.total ?? score.scores?.reduce((a, b) => a + b.score, 0) ?? 0)
                    })))
                } else throw new Error(result.error);
            } catch (error) {
                console.error({ error })
            }
        }
        if (student?.data != undefined && data?.scores === undefined) getScores(student.data._id);
    }, [data?.scores, student?.data]);

    return (
        <section className="flex items-center justify-center w-screen min-h-screen bg-gray-200 py-16 print:p-0 print:bg-white">
            <Head>
                <title>{data?.student?.name.full ?? "Loading student"} • Results | CBT | Grand Regal School</title>
                <meta name="description" content="Student • Results | GRS CBT" />
            </Head>
            {data !== undefined && (
                <main className="flex flex-col items-center justify-start bg-white rounded-lg shadow-xl shadow-gray-500/30 aspect-[1/1.4142] w-[60rem] p-12 print:px-8 print:py-5 print:shadow-none print:rounded-none">
                    <div className="flex gap-10 items-center justify-center w-full">
                        <figure className="w-24 h-24 relative">
                            <Image
                                priority
                                layout="fill"
                                alt="GRS Logo"
                                src="/Logo.png"
                                objectFit="contain"
                                objectPosition="center"
                            />
                        </figure>
                        <div className="flex flex-col items-center justify-center">
                            <h2 className="text-3xl font-extrabold uppercase text-gray-700 tracking-wider">Grand Regal International School</h2>
                            <p className="text-sm text-gray-700 pb-2">
                                Path to Peak for Excellence
                            </p>
                            <p className="text-xs text-gray-600 font-medium">
                                Hse. 2, 2nd Avenue, Wole Soyinka Drive, Gwarinpa, Abuja
                            </p>
                        </div>
                    </div>
                    <Divide
                        className="w-full py-7"
                        HRclassName="border-t-gray-300"
                    />
                    <div className="flex flex-wrap gap-10 items-center justify-between w-full">
                        <div className="flex flex-col items-start justify-center">
                            <div className="text-xs text-gray-500 font-semibold tracking-wide">Full Name</div>
                            <div className="font-semibold text-gray-800">{data.student?.name.full}</div>
                        </div>
                        <div className="flex flex-col items-start justify-center">
                            <div className="text-xs text-gray-500 font-semibold tracking-wide">Gender</div>
                            <div className="font-semibold text-gray-800">
                                {data.student?.gender === "M" ? "Male" : "Female"}
                            </div>
                        </div>
                        <div className="flex flex-col items-start justify-center">
                            <div className="text-xs text-gray-500 font-semibold tracking-wide">Class</div>
                            <div className="font-semibold text-gray-800">{data.class?.name ?? ''}</div>
                        </div>
                        <div className="flex flex-col items-start justify-center">
                            <div className="text-xs text-gray-500 font-semibold tracking-wide">Date of Birth</div>
                            <div className="font-semibold text-gray-800">
                                {data.student?.birthday === undefined ? "Not set" : format(new Date(data.student?.birthday), "do MMMM yyyy")}
                            </div>
                        </div>
                        <div className="flex flex-col items-start justify-center">
                            <div className="text-xs text-gray-500 font-semibold tracking-wide">Total Score</div>
                            <div className="font-semibold text-gray-800">
                                {total?.reduce((a, b) => a + b.total, 0)}
                            </div>
                        </div>
                    </div>
                    <Divide
                        className="w-full py-10"
                        HRclassName="border-t-gray-300"
                    />
                    <table className="min-w-full border border-gray-400 bg-white border-separate [border-spacing:0;] rounded-lg overflow-hidden">
                        <thead className="text-gray-700 bg-gray-50">
                            <tr className="divide-x divide-gray-400">
                                <th
                                    scope="col"
                                    className="py-5 border-b border-gray-400"
                                >
                                    <span className="sr-only">Subjects / Fields</span>
                                </th>
                                {[...(data.template?.fields ?? []), { alias: "Total" }, { alias: "Grade" }].map(field => (
                                    <th
                                        scope="col"
                                        key={field.alias}
                                        className="py-5 border-b border-gray-400 font-medium"
                                    >
                                        <span className="px-2 text-xs text-gray-700 font-semibold uppercase tracking-wider">
                                            {field.alias}
                                        </span>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-400 text-gray-600">
                            {data.subjects?.map((subject, index) => {
                                const scores = data.scores?.find(item => item.subject === subject._id);
                                const subjectTotal = total?.find(g => g.subject === subject._id)?.total ?? 0;
                                const scheme = data.template?.scheme.find(i => subjectTotal <= i.limit);

                                return scores !== undefined && (
                                    <tr
                                        key={subject.name}
                                        className={classNames("text-xs text-center text-gray-800 font-medium divide-x divide-gray-400", {
                                            "bg-gray-100": index % 2 === 1
                                        })}
                                    >
                                        <td className="text-gray-700 font-normal px-2 py-4 print:text-center">
                                            {subject.name}
                                        </td>
                                        {data.template?.fields.map(field => {
                                            const item = scores?.scores?.find(i => i.fieldId === field._id);

                                            return (
                                                <td
                                                    key={field._id.toString()}
                                                    className="py-4 w-16 print:w-12"
                                                >
                                                    {scores?.total === undefined && item?.score}
                                                </td>
                                            );
                                        })}
                                        <td className="py-4 px-1">
                                            {subjectTotal.toFixed(1)}
                                        </td>
                                        <td className="py-4 px-1 font-medium">
                                            {scheme?.grade}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    <Divide
                        className="w-full py-10"
                        HRclassName="border-t-gray-300"
                    />
                    <div className="grid grid-cols-2 [grid-template-rows:max-content_1fr] gap-x-20 items-center justify-between w-full">
                        <GradingScheme
                            scheme={data.template?.scheme ?? []}
                            className="row-start-1 row-end-2 col-start-2 col-end-3"
                        />
                        <ResultFields
                            fields={data.template?.fields ?? []}
                            className="row-span-full col-start-1 col-end-2"
                        />
                        <div className="flex flex-col gap-0.5 items-start justify-center row-start-2 row-end-3 col-start-2 col-end-3 mt-3">
                            <span className="text-sm font-medium text-gray-800 underline underline-offset-2">
                                Comment
                            </span>
                            <span className="text-sm text-gray-700 text-justify">
                                {data.comments}
                            </span>
                            <div className="w-52 h-20 self-center mt-8 relative">
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
                            <span className="self-center text-sm mt-2 font-medium text-gray-600 tracking-wide">
                                V.P. Academics Signature
                            </span>
                        </div>
                    </div>
                </main>
            )}
        </section>
    );
}

interface Data {
    comments: ResultRecord['comments'];
    scores: ResultRecord['data'];
    term: TermRecord;
    template: ClassResultSettingsGETData;
    class: Pick<ClassRecord, "_id" | "name">;
    session: Pick<SessionRecord, "_id" | "name">;
    subjects: Pick<SubjectRecord, "_id" | "name">[];
    student: Pick<StudentRecord, "_id" | "name" | "birthday" | "gender">;
};

export default Result;
