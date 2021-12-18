import { FunctionComponent } from "react";

import { classNames } from "utils";

import type { ClassRecord } from "types";

const GradingScheme: FunctionComponent<GradingSchemeProps> = ({ scheme, className }) => {
    return (
        <div className={className}>
            <table className="border border-gray-400 bg-white w-full">
                <thead className="text-gray-700 divide-y divide-gray-400 font-medium">
                    <tr>
                        <th
                            scope="col"
                            colSpan={3}
                            className="text-xs text-center py-1.5"
                        >
                            Grading scheme
                        </th>
                    </tr>
                    <tr className="text-xs bg-gray-100 divide-x divide-gray-400">
                        {["Marks", "Grade", "Description"].map(col => (
                            <th
                                key={col}
                                scope="col"
                                className="text-center w-1/3 py-2"
                            >
                                {col}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-400 border-t border-gray-400 text-gray-600">
                    {[...scheme].sort((a, b) => b.limit - a.limit).map((item, index) => (
                        <tr
                            key={item.grade}
                            className={classNames("text-xs text-center text-gray-800 font-medium divide-x divide-gray-400", {
                                "bg-gray-100": index % 2 === 1
                            })}
                        >
                            <td className="p-4">
                                {item.limit}
                            </td>
                            <td className="p-4">
                                {item.grade}
                            </td>
                            <td className="p-4">
                                {item.description}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

interface GradingSchemeProps extends Pick<ClassRecord["resultTemplate"][number]['terms'][number], 'scheme'> {
    className: string;
}

export default GradingScheme;
