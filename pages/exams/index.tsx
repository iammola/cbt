import useSWR from "swr";
import Head from "next/head";
import Link from "next/link";
import type { NextPage } from "next";
import { useCookies } from "react-cookie";
import { formatRelative } from "date-fns";

import { UserImage } from "components/Misc";
import { Navbar, Sidebar } from "components/Layout";

const Exams: NextPage = () => {
    const [{ account }] = useCookies(['account']);
    const { data: exams } = useSWR(account !== undefined ? `/api/teachers/${account._id}/exams` : null, url => url !== null && fetch(url).then(res => res.json()));

    return (
        <>
            <Head>
                <title>Exams | CBT | Grand Regal School</title>
                <meta name="description" content="Registered Exams | GRS CBT" />
            </Head>
            <section className="flex items-center justify-start w-screen h-screen divide-y-[1.5px] divide-gray-200">
                <Sidebar />
                <main className="flex flex-col flex-grow items-center justify-center divide-x-[1.5px] divide-gray-200 h-full">
                    <Navbar />
                    <section className="flex flex-col gap-3 items-center justify-start w-full py-10 px-6 flex-grow bg-gray-50/80 overflow-y-auto">
                        <table className="rounded-lg shadow-md overflow-hidden min-w-full">
                            <thead className="bg-gray-200 text-gray-700">
                                <tr>
                                    <th
                                        scope="col"
                                        className="py-5 w-4"
                                    >
                                        <span className="flex items-center justify-start pl-6 pr-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            #
                                        </span>
                                    </th>
                                    {["Class", "Subject", "Created At", "Created By"].map(i => (
                                        <th
                                            key={i}
                                            scope="col"
                                            className="py-5"
                                        >
                                            <span className="flex items-center justify-start pl-6 pr-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                {i}
                                            </span>
                                        </th>
                                    ))}
                                    <th
                                        scope="col"
                                        className="relative px-6 py-3"
                                    >
                                        <span className="sr-only">
                                            Edit
                                        </span>
                                    </th>
                                    {/* 
                                    <th
                                        scope="col"
                                        className="relative px-6 py-3"
                                    >
                                        <span className="sr-only">
                                            Preview
                                        </span>
                                    </th>
                                    <th
                                        scope="col"
                                        className="relative px-6 py-3"
                                    >
                                        <span className="sr-only">
                                            Delete
                                        </span>
                                    </th>
                                     */}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200 text-gray-600">
                                {(exams?.data as ExamRow[])?.map(({ subject, duration, questions, created: { at, by }, ...exam }, examIdx) => (
                                    <tr
                                        key={examIdx}
                                        className="text-sm font-medium"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {examIdx + 1}.
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {exam.class}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-col">
                                                <span className="text-sm text-gray-900">
                                                    {subject}
                                                </span>
                                                <span className="text-sm text-gray-500">
                                                    {duration} mins - {questions} questions
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {(() => {
                                                const date = formatRelative(new Date(at), new Date());
                                                return date[0].toUpperCase() + date.slice(1)
                                            })()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-4">
                                                <div className="flex-shrink-0 h-10 w-10 relative">
                                                    <UserImage
                                                        src=""
                                                        layout="fill"
                                                        objectFit="cover"
                                                        objectPosition="center"
                                                        className="rounded-full"
                                                        initials={{
                                                            text: by.name.initials,
                                                            className: "rounded-full bg-indigo-300"
                                                        }}
                                                    />
                                                </div>
                                                <span>
                                                    {by.name.fullName}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right tracking-wider">
                                            <Link href={`/edit/exams/${exam._id}`}>
                                                <a className="text-indigo-500 cursor-pointer hover:text-indigo-600">
                                                    Edit
                                                </a>
                                            </Link>
                                        </td>
                                        {/* 
                                    <td className="px-6 py-4 whitespace-nowrap text-right tracking-wider">
                                        <Link href="/exams/loops">
                                            <a className="text-indigo-500 cursor-pointer hover:text-indigo-600">
                                                Preview
                                            </a>
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <span className="text-indigo-500 cursor-pointer hover:text-indigo-900">
                                            Delete
                                        </span>
                                    </td>
                                    */}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>
                </main>
            </section>
        </>
    );
}

type ExamRow = {
    _id: string;
    class: string;
    questions: number;
    subject: string;
    created: {
        at: Date;
        by: any
    };
    duration: number;
};

export default Exams;
