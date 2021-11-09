import Head from "next/head";
import Link from "next/link";
import type { NextPage } from "next";
import { formatRelative } from "date-fns";

import { UserImage } from "components/Misc";
import { Navbar, Sidebar } from "components/Layout";

const Exams: NextPage = () => {
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
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200 text-gray-600">
                                <tr className="text-sm font-medium">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        1.
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        Key Stage 1
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex flex-col">
                                            <span className="text-sm text-gray-900">
                                                Pre-Vocational Studies
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                30 mins - 40 questions
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {(() => {
                                            const date = formatRelative(new Date('2021-11-08T12:44:06.401+00:00'), new Date());
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
                                                        text: 'AA',
                                                        className: "rounded-full bg-indigo-300"
                                                    }}
                                                />
                                            </div>
                                            <span>
                                                Ademola Adedeji
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right tracking-wider">
                                        <Link href="/create/exams/loops">
                                            <a className="text-indigo-500 cursor-pointer hover:text-indigo-600">
                                                Edit
                                            </a>
                                        </Link>
                                    </td>
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
                                </tr>
                            </tbody>
                        </table>
                    </section>
                </main>
            </section>
        </>
    );
}

export default Exams;
