import { FunctionComponent } from "react";

import { classNames } from "utils";

import type { ClassRecord } from "types";

const ResultFields: FunctionComponent<ResultFieldsProps> = ({
  fields,
  className,
}) => {
  return (
    <div className={className}>
      <table className="w-full border-separate overflow-hidden rounded-lg border border-gray-400 bg-white [border-spacing:0;]">
        <thead className="divide-y divide-gray-400 font-medium text-gray-700">
          <tr>
            <th scope="col" colSpan={2} className="py-1.5 text-center text-xs">
              Result fields
            </th>
          </tr>
          <tr className="divide-x divide-gray-400 bg-gray-100 text-xs">
            {["Name (Alias)", "Obtainable Marks"].map((col) => (
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
          {fields.map((item, index) => (
            <tr
              key={item.name}
              className={classNames(
                "divide-x divide-gray-400 text-center text-xs font-medium text-gray-800",
                {
                  "bg-gray-100": index % 2 === 1,
                }
              )}
            >
              <td className="p-4">
                {item.name} ({item.alias})
              </td>
              <td className="p-4">{item.max}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

interface ResultFieldsProps
  extends Pick<
    ClassRecord["resultTemplate"][number]["terms"][number],
    "fields"
  > {
  className: string;
}

export default ResultFields;
