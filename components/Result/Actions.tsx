import Link from "next/link";
import { FunctionComponent } from "react";
import { ChevronLeftIcon, PrinterIcon } from "@heroicons/react/solid";

const Actions: FunctionComponent<{ pickerLink: string }> = ({ pickerLink }) => {
  return (
    <div className="fixed bottom-10 flex items-center justify-between gap-x-6 rounded-full bg-slate-200 py-4 px-6 shadow">
      <Link href={pickerLink}>
        <a className="block">
          <div className="aspect-square h-[4.5rem] w-[4.5rem] cursor-pointer overflow-hidden rounded-full bg-white p-3.5 shadow shadow-slate-800/25 hover:bg-gray-50">
            <ChevronLeftIcon className="h-full w-full fill-slate-500" />
          </div>
        </a>
      </Link>
      <button
        type="button"
        onClick={() => print()}
        className="aspect-square h-[4.5rem] w-[4.5rem] cursor-pointer overflow-hidden rounded-full bg-white p-3.5 shadow shadow-slate-800/25 hover:bg-gray-50"
      >
        <PrinterIcon className="h-full w-full fill-slate-500" />
      </button>
    </div>
  );
};

export default Actions;
