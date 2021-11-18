import useSWR from "swr";
import { FunctionComponent } from "react";
import { ChevronRightIcon, CheckIcon } from "@heroicons/react/solid";

import { LoadingIcon } from "components/Misc/Icons";

import { TeacherBarProps } from "types";

const Bar: FunctionComponent<TeacherBarProps> = ({ exam, save, modified, saved, uploading, uploaded }) => {
    const { data: currentSession } = useSWR('/api/sessions/current/', url => fetch(url).then(res => res.json()));

    return (
        <div className="flex items-center justify-end gap-6 w-full bg-white py-5 px-8 sticky left-0 top-0 rounded-b-lg drop-shadow-sm">
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
                <ChevronRightIcon className="w-5 h-5 text-gray-500" />
                <span className="w-max block truncate">{exam?.class ?? "Select Class"}</span>
                <ChevronRightIcon className="w-5 h-5 text-gray-500" />
                <span className="w-max block truncate">{exam?.subject ?? "Select Subject"}</span>
                <ChevronRightIcon className="w-5 h-5 text-gray-500" />
                <span className="text-gray-600">Questions</span>
            </div>
            <button
                type="button"
                onClick={() => save()}
                title={modified === true ? "Changes made. Don't forget to save" : saved === true ? "No changes made." : ""}
                className="flex items-center justify-center gap-2 py-3 px-8 tracking-wider text-xs font-medium bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-md shadow-sm"
            >
                {modified === true && (
                    <span className="w-2 h-2 rounded-full bg-indigo-300" />
                )}
                {saved === true && (
                    <CheckIcon className="w-5 h-5" />
                )}
                Save
            </button>
            <button
                type="submit"
                className="flex items-center justify-center gap-2 py-3 px-8 tracking-wider text-xs font-medium bg-indigo-500 hover:bg-indigo-600 text-white rounded-md shadow-sm"
            >
                {uploading === true && (
                    <LoadingIcon className="animate-spin w-5 h-5" />
                )}
                {uploaded === true && (
                    <CheckIcon className="w-5 h-5" />
                )}
                Submit
            </button>
        </div>
    );
}

export default Bar;
