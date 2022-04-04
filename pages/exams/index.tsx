import useSWR from "swr";
import Head from "next/head";
import Link from "next/link";
import type { NextPage } from "next";
import { useCookies } from "react-cookie";
import { formatRelative } from "date-fns";

import { capitalizeFirst } from "utils";
import { UserImage } from "components/Misc";
import { Navbar, Sidebar } from "components/Layout";
import { MeditatingIllustration, SittingWithLaptopIllustration } from "components/Misc/Illustrations";

import type { RouteData } from "types";
import type { TeacherExamsGETData } from "types/api";

const Exams: NextPage = () => {
  const [{ account }] = useCookies(["account"]);
  const { data: exams } = useSWR<RouteData<TeacherExamsGETData>>(
    account !== undefined ? `/api/teachers/${account._id}/exams` : null
  );

  return (
    <>
      <Head>
        <title>Exams | CBT | Grand Regal School</title>
        <meta
          name="description"
          content="Registered Exams | GRS CBT"
        />
      </Head>
      <section className="flex h-screen w-screen items-center justify-start divide-y-[1.5px] divide-gray-200">
        <Sidebar />
        <main className="flex h-full grow flex-col items-center justify-center divide-x-[1.5px] divide-gray-200">
          <Navbar />
          <section className="flex w-full grow flex-col items-center justify-start gap-3 overflow-y-auto bg-gray-50/80 py-10 px-6">
            <table className="min-w-full overflow-hidden rounded-lg shadow-md">
              <thead className="bg-gray-200 text-gray-700">
                <tr>
                  <th
                    scope="col"
                    className="w-4 py-5"
                  >
                    <span className="flex items-center justify-start pl-6 pr-3 text-xs font-medium uppercase tracking-wider text-gray-500">
                      #
                    </span>
                  </th>
                  {["Class", "Subject", "Created At", "Created By"].map((i) => (
                    <th
                      key={i}
                      scope="col"
                      className="py-5"
                    >
                      <span className="flex items-center justify-start pl-6 pr-3 text-xs font-medium uppercase tracking-wider text-gray-500">
                        {i}
                      </span>
                    </th>
                  ))}
                  <th
                    scope="col"
                    className="relative px-6 py-3"
                  >
                    <span className="sr-only">Edit</span>
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
              <tbody className="divide-y divide-gray-200 bg-white text-gray-600">
                {exams?.data?.map(({ subject, duration, questions, created: { at, by }, ...exam }, idx) => (
                  <tr
                    key={idx}
                    className="text-sm font-medium"
                  >
                    <td className="whitespace-nowrap px-6 py-4">{idx + 1}.</td>
                    <td className="whitespace-nowrap px-6 py-4">{exam.class}</td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-900">{subject}</span>
                        <span className="text-sm text-gray-500">
                          {duration} mins - {questions} questions
                        </span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {capitalizeFirst(formatRelative(new Date(at), new Date()))}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative h-10 w-10 shrink-0">
                          <UserImage
                            src=""
                            layout="fill"
                            objectFit="cover"
                            objectPosition="center"
                            className="rounded-full"
                            initials={{
                              text: by.name.initials,
                              className: "rounded-full bg-indigo-300",
                            }}
                          />
                        </div>
                        <span>{by.name.full}</span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right tracking-wider">
                      <Link href={`/exams/edit/${exam._id.toString()}`}>
                        <a className="cursor-pointer text-indigo-500 hover:text-indigo-600">Edit</a>
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
            {exams?.data?.length === 0 && (
              <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-sm font-medium tracking-wider text-gray-600">
                <MeditatingIllustration className="h-60 w-60" />
                nothing to see here
              </div>
            )}
            {exams === undefined && (
              <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-sm font-medium tracking-wider text-gray-600">
                <SittingWithLaptopIllustration className="h-60 w-60" />
                Loading exams...
              </div>
            )}
          </section>
        </main>
      </section>
    </>
  );
};

export default Exams;
