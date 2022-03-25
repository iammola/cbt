import { format } from "date-fns";
import { FunctionComponent } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/solid";

export const Header: FunctionComponent<HeaderProps> = ({ date, monthPrev, monthNext }) => {
  return (
    <header className="flex w-full items-center justify-between">
      <h2 className="text-5xl">
        <span className="font-bold text-gray-100">{format(date, "MMMM")}</span>{" "}
        <span className="font-normal text-gray-200">{date.getFullYear()}</span>
      </h2>
      <div className="flex items-center justify-center">
        <button
          type="button"
          onClick={monthPrev}
          className="rounded-tl-md rounded-bl-md bg-gray-200 p-2 hover:bg-gray-300 focus:outline-none"
        >
          <ChevronLeftIcon className="h-5 w-5 fill-neutral-500" />
        </button>
        <button
          type="button"
          onClick={monthNext}
          className="rounded-tr-md rounded-br-md bg-gray-200 p-2 hover:bg-gray-300 focus:outline-none"
        >
          <ChevronRightIcon className="h-5 w-5 fill-neutral-500" />
        </button>
      </div>
    </header>
  );
};

interface HeaderProps {
  date: Date;
  monthPrev(): void;
  monthNext(): void;
}
