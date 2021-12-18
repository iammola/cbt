import Head from "next/head";
import Image from "next/image";
import { format } from "date-fns";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWRImmutable from "swr/immutable";

import { Divide } from "components/Misc";

import type { ClassGETData } from "types/api/classes";
import type { StudentGETData } from "types/api/students";
import type { SessionCurrentGETData } from "types/api/sessions";
import type { ClassRecord, ClientResponse, RouteData, SessionRecord, StudentRecord, TermRecord } from "types";

const Result: NextPage = () => {
    const router = useRouter();
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
                const { academic } = student?.data;
                const { session, term } = data ?? {};
                const active = academic.find(i => i.session === session?._id)?.terms.find(i => i.term === term?._id);

                if (active?.class !== undefined) getClass(active.class);
            }
        }
    }, [data, student]);

    return (
        <section className="flex items-center justify-center w-screen min-h-screen bg-gray-200 p-10 xl:p-20 2xl:p-24">
            <Head>
                <title>{data?.student?.name.full ?? "Loading student"} • Results | CBT | Grand Regal School</title>
                <meta name="description" content="Student • Results | GRS CBT" />
            </Head>
            {data !== undefined && (
                <main className="flex flex-col items-center justify-start w-full bg-white rounded-lg shadow-xl shadow-gray-500/30 aspect-[1/1.4142] p-10">
                    <div className="flex gap-6 items-center justify-center w-full">
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
                        <h2 className="text-4xl font-extrabold uppercase text-gray-700 tracking-wider">Grand Regal School</h2>
                    </div>
                    <Divide
                        className="w-full py-7"
                        HRclassName="border-t-gray-300"
                    />
                    <div className="flex flex-wrap gap-10 items-center justify-center w-full">
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
                            <div className="text-xs text-gray-500 font-semibold tracking-wide">Overall Score</div>
                            <div className="font-semibold text-gray-800">
                                893
                            </div>
                        </div>
                        <div className="flex flex-col items-start justify-center">
                            <div className="text-xs text-gray-500 font-semibold tracking-wide">Class Average</div>
                            <div className="font-semibold text-gray-800">
                                1012.3
                            </div>
                        </div>
                    </div>
                    <Divide
                        className="w-full py-10"
                        HRclassName="border-t-gray-300"
                    />
                </main>
            )}
        </section>
    );
}

interface Data {
    term: TermRecord;
    class: Pick<ClassRecord, "_id" | "name">;
    session: Pick<SessionRecord, "_id" | "name">;
    student: Pick<StudentRecord, "_id" | "name" | "birthday" | "gender">;
};

export default Result;
