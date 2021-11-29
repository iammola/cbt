import { format } from "date-fns";
import useSWRImmutable from "swr";
import { FunctionComponent } from "react";
import { CheckIcon, ChevronRightIcon, XIcon } from "@heroicons/react/solid";

import { LoadingIcon } from "components/Misc/Icons";

import { classNames } from "utils";

import type { StudentBarProps } from "types/components";

const Bar: FunctionComponent<StudentBarProps> = ({ exam, loading, success }) => {
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
                className={classNames("flex gap-4 items-center justify-center mt-3 py-2.5 px-6 text-sm font-medium rounded-md shadow-md text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2  focus:ring-offset-white", {
                    "bg-violet-400 hover:bg-violet-500 focus:ring-violet-500": success === undefined,
                    "bg-emerald-400 hover:bg-emerald-500 focus:ring-emerald-500": success === true,
                    "bg-red-400 hover:bg-red-500 focus:ring-red-500": success === false,
                })}
            >
                {loading === true && (
                    <LoadingIcon className="animate-spin w-5 h-5 stroke-white" />
                )}
                {success === true && (
                    <CheckIcon className="w-5 h-5 fill-white" />
                )}
                {success === false && (
                    <XIcon className="w-5 h-5 fill-white" />
                )}
                Submit
            </button>
        </div>
    );
}

export default Bar;
