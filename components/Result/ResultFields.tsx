import { FunctionComponent } from "react";

import { classNames } from "utils";

import type { ClassRecord } from "types";

const ResultFields: FunctionComponent<ResultFieldsProps> = ({
  fields,
  className,
}) => {
  return (
    <div className={className}>
      <table className="border border-gray-400 bg-white w-full border-separate [border-spacing:0;] rounded-lg overflow-hidden">
        <thead className="text-gray-700 divide-y divide-gray-400 font-medium">
          <tr>
            <th scope="col" colSpan={2} className="text-xs text-center py-1.5">
              Result fields
            </th>
          </tr>
          <tr className="text-xs bg-gray-100 divide-x divide-gray-400">
            {["Name (Alias)", "Obtainable Marks"].map((col) => (
              <th
                key={col}
                scope="col"
                className="text-center w-1/3 py-2 border-b border-gray-400"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-400 text-gray-600">
          {fields.map((item, index) => (
            <tr
              key={item.name}
              className={classNames(
                "text-xs text-center text-gray-800 font-medium divide-x divide-gray-400",
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
