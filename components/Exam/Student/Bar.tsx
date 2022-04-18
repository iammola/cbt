import { format } from "date-fns";
import useSWRImmutable from "swr/immutable";
import { ChevronRightIcon } from "@heroicons/react/solid";

import type { StudentBarProps } from "types/components";

const Bar: React.FC<StudentBarProps> = ({ exam, onSubmit }) => {
  const { data: currentSession } = useSWRImmutable("/api/sessions/current/");

  return (
    <div className="sticky left-0 top-0 flex w-full items-center justify-end gap-6 rounded-b-lg bg-white py-4 px-8 drop-shadow-sm">
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
        <span className="block w-max truncate">{exam?.class ?? "Loading Class"}</span>
        <ChevronRightIcon className="h-5 w-5 fill-gray-500" />
        <span className="block w-max truncate">{exam?.subject ?? "Loading Subject"}</span>
        <ChevronRightIcon className="h-5 w-5 fill-gray-500" />
        <span className="text-gray-600">{format(new Date(), "EEEE do MMM, yyyy")}</span>
      </div>
      <button
        type="button"
        onClick={onSubmit}
        className="mt-3 flex items-center justify-center gap-4 rounded-md bg-violet-400 py-2.5 px-6 text-sm font-medium text-white shadow-md transition-colors hover:bg-violet-500 focus:outline-none  focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-white"
      >
        Submit
      </button>
    </div>
  );
};

export default Bar;
