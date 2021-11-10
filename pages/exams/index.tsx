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
                                            </div>
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
                            </tbody>
                        </table>
                    </section>
                </main>
            </section>
        </>
    );
}

export default Exams;
