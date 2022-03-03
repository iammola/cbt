import useSWR from "swr";
import Link from "next/link";
import { useCookies } from "react-cookie";
import { formatRelative, isPast } from "date-fns";
import { DesktopComputerIcon } from "@heroicons/react/outline";
import { FunctionComponent, useEffect, useState } from "react";

import { NotificationsHook } from "components/Misc/Notification";
import { classNames } from "utils";

import type { RouteData } from "types";
import type { StudentExamsGETData } from "types/api/students";

const Exam: FunctionComponent<{
  addNotification: NotificationsHook[0];
  show: boolean;
}> = ({ addNotification, show }) => {
  const [{ account }] = useCookies(["account"]);
  const [firstLoad, setFirstLoad] = useState(true);
  const [, setNotification] = useState<number>();
  const [exams, setExams] = useState<StudentExamsGETData>([]);
  const { data } = useSWR<RouteData<StudentExamsGETData>>(
    `/api/students/${account?._id}/exams/`,
    (url) => fetch(url ?? "").then((res) => res.json())
  );

  useEffect(() => {
    if (data !== undefined)
      setExams(
        data.data.map((exam) => ({
          ...exam,
          locked: !isPast(new Date(exam.date)),
        }))
      );
  }, [data]);

  useEffect(() => {
    if (firstLoad && data === undefined) {
      setFirstLoad(false);
      setNotification(
        addNotification({
          message: "Loading Exams",
          timeout: 3e3,
          Icon: () => (
            <DesktopComputerIcon className="h-6 w-6 stroke-blue-500" />
          ),
        })[0]
      );
      setTimeout(setNotification, 5e3, undefined);
    }
  }, [addNotification, data, firstLoad]);

  return (
    <section
      className={classNames(
        "flex content-start items-start justify-start gap-x-5 gap-y-3",
        {
          hidden: !show,
        }
      )}
    >
      <table className="min-w-full overflow-hidden rounded-lg shadow-md">
        <thead className="bg-gray-200 text-gray-700">
          <tr>
            {["Subject", "Status", "Date"].map((i) => (
              <th
                key={i}
                scope="col"
                className={classNames("py-3", { "w-4": i === "#" })}
              >
                <span className="flex items-center justify-start pl-6 pr-3 text-xs font-normal uppercase tracking-wider text-gray-500">
                  {i}
                </span>
              </th>
            ))}
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Start Exam</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white text-gray-600">
          {exams?.map((i) => (
            <tr key={i._id.toString()}>
              <td className="whitespace-nowrap px-6 py-4">
                <div className="flex flex-col items-start justify-center text-sm">
                  <span className="text-gray-900">{i.subject}</span>
                  <span className="text-gray-500">
                    {i.duration} minutes • {i.questions} questions
                  </span>
                </div>
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                <span
                  className={classNames(
                    "inline-flex rounded-full px-3 py-0.5 text-sm leading-5",
                    {
                      "bg-blue-200/25 text-blue-600": i.locked === false,
                      "bg-slate-200/25 text-slate-600": i.locked !== false,
                    }
                  )}
                >
                  {i.locked !== false ? "Locked" : "Unlocked"}
                </span>
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm">
                {(() => {
                  const date = formatRelative(new Date(i.date), new Date());
                  return date[0].toUpperCase() + date.slice(1);
                })()}
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                {i.locked === false && (
                  <button
                    type="button"
                    className="flex items-center justify-center rounded-full bg-gray-500 py-2 px-4 hover:bg-gray-600"
                  >
                    <Link href={`/exams/write/${i._id}`}>
                      <a className="text-xs font-medium tracking-wide text-white">
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
};

export default Exam;
