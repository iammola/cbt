import useSWR from "swr";
import { Fragment } from "react";

import type { NextPage } from "next";
import type { RouteData } from "types";
import type { CodesGETData } from "types/api";

const Codes: NextPage = () => {
  const { data: { data } = {}, error } = useSWR<RouteData<CodesGETData>>("/api/codes");

  return (
    <div className="prose prose-slate max-w-none w-full h-full p-5 md:p-10 text-sm tracking-wide">
      <h2 className="text-center">Student Codes</h2>
      {data ? (
        Object.entries(
          data.students
            .sort((a, b) => a.academic[0].class.order - b.academic[0].class.order)
            .reduce<{ [K: string]: CodesGETData["students"] }>((acc, cur) => {
              const { name } = cur.academic[0].class;
              return { ...acc, [name]: [...(acc[name] ?? []), cur] };
            }, {})
        ).map(([name, students]) => (
          <Fragment key={name}>
            <h4>{name}</h4>
            <ul>
              {students.map(({ _id, name, code }) => (
                <li key={_id}>
                  {name.full} - {code}
                </li>
              ))}
            </ul>
          </Fragment>
        ))
      ) : (
        <div className="w-full text-center">
          <h3>{error == null ? "Loading..." : "Error Fetching Codes"}</h3>
        </div>
      )}
    </div>
  );
};

export default Codes;
