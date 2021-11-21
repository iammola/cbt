import { format } from "date-fns";
import useSWRImmutable from "swr";
import { FunctionComponent } from "react";
import { ChevronRightIcon } from "@heroicons/react/solid";

import type { StudentBarProps } from "types/components";

const Bar: FunctionComponent<StudentBarProps> = ({ exam }) => {
    const { data: currentSession } = useSWRImmutable('/api/sessions/current/', url => fetch(url).then(res => res.json()));

    return (
        <div className="flex items-center justify-end gap-6 w-full bg-white py-4 px-8 sticky left-0 top-0 rounded-b-lg drop-shadow-sm">
            <div className="hidden md:flex items-center justify-start gap-2 grow text-gray-400 w-full text-sm font-medium">
                <span className="w-max block truncate">
                    {currentSession !== undefined ? (
                        currentSession.data !== null ? (
                            <>
                                <span className="inline-block sm:hidden">
                                    {currentSession.data.alias}{' '}
                                    {currentSession.data.terms[0].alias}
                                </span>
                                <span className="hidden sm:inline-block">
                                    {currentSession.data.name}{' '}
                                    {currentSession.data.terms[0].name}
                                </span>{' '}Term
                            </>
                        ) : "No Current Session"
                    ) : "Loading Session"}
                </span>
                <ChevronRightIcon className="w-5 h-5 fill-gray-500" />
                <span className="w-max block truncate">
                    {exam?.class ?? "Loading Class"}
                </span>
                <ChevronRightIcon className="w-5 h-5 fill-gray-500" />
                <span className="w-max block truncate">
                    {exam?.subject ?? "Loading Subject"}
                </span>
                <ChevronRightIcon className="w-5 h-5 fill-gray-500" />
                <span className="text-gray-600">
                    {format(new Date(), 'EEEE do MMM, yyyy')}
                </span>
            </div>
            <button
                type="submit"
                className="flex items-center justify-center gap-2 py-3 px-8 tracking-wider text-xs font-medium bg-indigo-500 hover:bg-indigo-600 text-white rounded-md shadow-sm"
            >
                Submit
            </button>
        </div>
    );
}

export default Bar;
