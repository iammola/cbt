import { format } from "date-fns";
import { Fragment, FunctionComponent } from "react";
import { Dialog, Transition } from "@headlessui/react";

import { Events } from "./Events";

export const AllEvents: FunctionComponent<AllEventsProps> = ({ data, date, onClose, show }) => {
  return (
    <Transition
      show={show}
      as={Fragment}
    >
      <Dialog
        as="aside"
        onClose={onClose}
        className="font-urbane fixed inset-0 z-[100] flex items-center justify-center"
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Dialog.Overlay className="fixed inset-0 -z-10 cursor-pointer bg-black/30" />
        </Transition.Child>
        <Transition.Child
          as={Fragment}
          enter="duration-300 ease-out"
          enterFrom="scale-95 opacity-0"
          enterTo="scale-100 opacity-100"
          leave="duration-200 ease-in"
          leaveFrom="scale-100 opacity-100"
          leaveTo="scale-95 opacity-0"
        >
          <div className="max-h-[65vh] w-full max-w-xl space-y-5 overflow-y-auto rounded-2xl bg-white p-6">
            <Dialog.Title className="text-center text-xl font-medium tracking-wide text-slate-700">
              {format(new Date(date), "EEEE, do MMMM yyyy")}
            </Dialog.Title>
            <Events
              data={data}
              className="w-full space-y-2"
              timeClassName="shrink-0 text-xs font-medium tracking-wider text-gray-400"
              eventClassName="block grow ml-2 text-sm tracking-wide font-medium text-gray-600"
            />
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
};

interface AllEventsProps {
  show: boolean;
  onClose(v: boolean): void;
  date: Date;
  data: {
    time: string;
    events: string[];
  }[];
}
