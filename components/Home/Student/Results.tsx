import useSWR from "swr";
import { useCookies } from "react-cookie";
import { formatRelative } from "date-fns";
import { FunctionComponent } from "react";

import { classNames } from "utils";

import type { RouteData } from "types";
import type { StudentCBTResultsGETData } from "types/api/students";

const Result: FunctionComponent<{ show: boolean }> = ({ show }) => {
  const [{ account }] = useCookies(["account"]);
  const { data } = useSWR<RouteData<StudentCBTResultsGETData>>(`/api/students/${account?._id}/cbt_results/`, (url) =>
    fetch(url ?? "").then((res) => res.json())
  );

  return (
    <section
      className={classNames("flex content-start items-start justify-start gap-x-5 gap-y-3", {
        hidden: !show,
      })}
    >
      <table className="min-w-full overflow-hidden rounded-lg shadow-md">
        <thead className="bg-gray-200 text-gray-700">
          <tr>
            {["Subject", "Score", "Date"].map((i) => (
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
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white text-gray-600">
          {data?.data.map((e) => (
            <tr key={e.subject}>
              <td className="whitespace-nowrap px-6 py-4">
                <div className="flex flex-col items-start justify-center text-sm text-gray-900">{e.subject}</div>
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm">{e.score}</td>
              <td className="whitespace-nowrap px-6 py-4 text-sm">
                {(() => {
                  const date = formatRelative(new Date(e.started), new Date());
                  return date[0].toUpperCase() + date.slice(1);
                })()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default Result;
