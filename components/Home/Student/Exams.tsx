import useSWR from "swr";
import Link from "next/link";
import { useCookies } from "react-cookie";
import { formatRelative, isPast } from "date-fns";
import { DesktopComputerIcon } from "@heroicons/react/outline";
import { FunctionComponent, useCallback, useEffect, useState } from "react";

import { NotificationsHook } from "components/Misc/Notification";
import { classNames } from "utils";

import type { RouteData } from "types";
import type { StudentExamsGETData } from "types/api/students";

const Exam: FunctionComponent<{ addNotification: NotificationsHook[0] }> = ({ addNotification }) => {
    const [{ account }] = useCookies(['account']);
    const [firstLoad, setFirstLoad] = useState(true);
    const [notification, setNotification] = useState<number>();
    const [exams, setExams] = useState<StudentExamsGETData>([]);
    const { data } = useSWR<RouteData<StudentExamsGETData>>(`/api/students/${account?._id}/exams/`, url => fetch(url ?? '').then(res => res.json()));

    useEffect(() => {
        if (data !== undefined) setExams(data.data.map(exam => ({
            ...exam,
            locked: isPast(new Date(exam.date)) === false
        })));
    }, [data]);

    useEffect(() => {
        if (firstLoad === true && data === undefined) {
            setFirstLoad(false);
            setNotification(addNotification({
                message: "Loading Exams",
                timeout: 3e3,
                Icon: () => <DesktopComputerIcon className="w-6 h-6 stroke-blue-500" />
            })[0]);
            setTimeout(setNotification, 5e3, undefined)
        }
    }, [addNotification, data, firstLoad]);

    return (
        <section className="flex gap-x-5 gap-y-3 items-start content-start justify-start">
            <table className="rounded-lg shadow-md overflow-hidden min-w-full">
                <thead className="bg-gray-200 text-gray-700">
                    <tr>
                        {["Subject", "Status", "Date"].map(i => (
                            <th
                                key={i}
                                scope="col"
                                className={classNames("py-3", { "w-4": i === "#" })}
                            >
                                <span className="flex items-center justify-start pl-6 pr-3 text-xs text-gray-500 font-normal uppercase tracking-wider">
                                    {i}
                                </span>
                            </th>
                        ))}
                        <th
                            scope="col"
                            className="relative px-6 py-3"
                        >
                            <span className="sr-only">
                                Start Exam
                            </span>
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 text-gray-600">
                    {exams?.map(i => (
                        <tr key={i._id.toString()}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex flex-col items-start justify-center text-sm">
                                    <span className="text-gray-900">
                                        {i.subject}
                                    </span>
                                    <span className="text-gray-500">
                                        {i.duration} minutes • {i.questions} questions
                                    </span>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={classNames("inline-flex text-sm leading-5 rounded-full px-3 py-0.5", {
                                    "text-blue-600 bg-blue-200/25": i.locked === false,
                                    "text-slate-600 bg-slate-200/25": i.locked !== false,
                                })}>
                                    {i.locked !== false ? "Locked" : "Unlocked"}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                {(() => {
                                    const date = formatRelative(new Date(i.date), new Date());
                                    return date[0].toUpperCase() + date.slice(1)
                                })()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {i.locked === false && (
                                    <button
                                        type="button"
                                        className="flex items-center justify-center py-2 px-4 rounded-full bg-gray-500 hover:bg-gray-600"
                                    >
                                        <Link href={`/exams/write/${i._id}`}>
                                            <a className="text-white text-xs font-medium tracking-wide">
                                                Go to exam
                                            </a>
                                        </Link>
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </section>
    );
}

export default Exam;
