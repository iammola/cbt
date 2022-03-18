import { FunctionComponent } from "react";

import { classNames } from "utils";

import type { ClassRecord } from "types";

const GradingScheme: FunctionComponent<GradingSchemeProps> = ({ scheme, className }) => {
  return (
    <div className={className}>
      <table className="w-full border-separate overflow-hidden rounded-lg border border-gray-400 bg-white [border-spacing:0;]">
        <thead className="divide-y divide-gray-400 font-medium text-gray-700">
          <tr>
            <th
              scope="col"
              colSpan={3}
              className="py-1.5 text-center text-xs"
            >
              Grading scheme
            </th>
          </tr>
          <tr className="divide-x divide-gray-400 bg-gray-100 text-xs">
            {["Marks", "Grade", "Description"].map((col) => (
              <th
                key={col}
                scope="col"
                className="w-1/3 border-b border-gray-400 py-2 text-center"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-400 bg-white text-gray-600">
          {[...scheme]
            .sort((a, b) => b.limit - a.limit)
            .map((item, index) => (
              <tr
                key={item.grade}
                className={classNames("divide-x divide-gray-400 text-center text-xs font-medium text-gray-800", {
                  "bg-gray-100": index % 2 === 1,
                })}
              >
                <td className="p-4">{item.limit}</td>
                <td className="p-4">{item.grade}</td>
                <td className="p-4">{item.description}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

interface GradingSchemeProps extends Pick<ClassRecord["resultTemplate"][number]["terms"][number], "scheme"> {
  className: string;
}

export default GradingScheme;
