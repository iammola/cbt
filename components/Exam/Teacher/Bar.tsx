import useSWRImmutable from "swr/immutable";
import { FunctionComponent } from "react";
import { ChevronRightIcon, CheckIcon } from "@heroicons/react/solid";

import { LoadingIcon } from "components/Misc/Icons";

import type { RouteData, TeacherBarProps } from "types";
import type { SessionCurrentGETData } from "types/api";

const Bar: FunctionComponent<TeacherBarProps> = ({ exam, save, modified, saved, uploading, uploaded }) => {
  const { data: currentSession } = useSWRImmutable<RouteData<SessionCurrentGETData>>("/api/sessions/current/");

  return (
    <div className="sticky left-0 top-0 flex w-full items-center justify-end gap-6 rounded-b-lg bg-white py-5 px-8 drop-shadow-sm">
      <div className="hidden w-full grow items-center justify-start gap-2 text-sm font-medium text-gray-400 md:flex">
        <span className="block w-max truncate">
          {currentSession !== undefined ? (
            currentSession.data !== null ? (
              <>
                <span className="inline-block sm:hidden">
                  {currentSession.data.alias} {currentSession.data.terms[0].alias}
                </span>
                <span className="hidden sm:inline-block">
                  {currentSession.data.name} {currentSession.data.terms[0].name}
                </span>{" "}
                Term
              </>
            ) : (
              "No Current Session"
            )
          ) : (
            "Loading Session"
          )}
        </span>
        <ChevronRightIcon className="h-5 w-5 fill-gray-500" />
        <span className="block w-max truncate">{exam?.class ?? "Select Class"}</span>
        <ChevronRightIcon className="h-5 w-5 fill-gray-500" />
        <span className="block w-max truncate">{exam?.subject ?? "Select Subject"}</span>
        <ChevronRightIcon className="h-5 w-5 fill-gray-500" />
        <span className="text-gray-600">Questions</span>
      </div>
      <button
        type="button"
        onClick={() => save()}
        title={modified ? "Changes made. Don't forget to save" : saved ? "No changes made." : ""}
        className="flex items-center justify-center gap-2 rounded-md bg-indigo-100 py-3 px-8 text-xs font-medium tracking-wider text-indigo-700 shadow-sm hover:bg-indigo-200"
      >
        {modified && <span className="h-2 w-2 rounded-full bg-indigo-300" />}
        {saved && <CheckIcon className="h-5 w-5 fill-indigo-700" />}
        Save
      </button>
      <button
        type="submit"
        className="flex items-center justify-center gap-2 rounded-md bg-indigo-500 py-3 px-8 text-xs font-medium tracking-wider text-white shadow-sm hover:bg-indigo-600"
      >
        {uploading && <LoadingIcon className="h-5 w-5 animate-spin stroke-white" />}
        {uploaded && <CheckIcon className="h-5 w-5 fill-white" />}
        Submit
      </button>
    </div>
  );
};

export default Bar;
