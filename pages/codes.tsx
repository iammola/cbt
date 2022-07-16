import useSWR from "swr";

import type { NextPage } from "next";
import type { RouteData } from "types";
import type { CodesGETData } from "types/api";

const Codes: NextPage = () => {
  const { data: { data } = {} } = useSWR<RouteData<CodesGETData>>("/api/codes");

  return (
    <div className="prose max-w-none w-full h-full">
      <ul>
        {data?.students.map(({ _id, name, code }) => (
          <li key={_id}>
            {name.full} - {code}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Codes;
