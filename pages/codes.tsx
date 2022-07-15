import useSWR from "swr";

import type { NextPage } from "next";

const Codes: NextPage = () => {
  const { data } = useSWR("/api/codes?filter=students");

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
