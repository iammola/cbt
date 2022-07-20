import { Fragment, useEffect, useState } from "react";
import { Transition, Dialog } from "@headlessui/react";

const Loader: React.FC<{ show: boolean }> = ({ show }) => {
  useEffect(() => {
    const html = document.documentElement;
    const setTimer = (): NodeJS.Timeout =>
      setTimeout(() => {
        if (html.hasAttribute("style")) {
          html.removeAttribute("style");
          setTimeout(setTimer, 1);
        }
      }, 1e3);

    setTimer();
  });

  return (
    <Transition
      appear
      show={show}
      as={Fragment}
    >
      <Dialog
        as="section"
        onClose={() => {}}
        className="fixed inset-0 z-50 flex h-screen w-full items-center justify-center p-8 backdrop-blur-sm"
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300 transition-opacity"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200 transition-opacity"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Dialog.Overlay className="fixed inset-0 z-[-1] h-full w-full bg-black/30" />
        </Transition.Child>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300 transition"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200 transition"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="flex w-full flex-col items-center gap-7 rounded-3xl bg-white p-12 shadow-lg sm:w-[50rem]">
            <Dialog.Title className="pb-4 text-center text-4xl font-bold tracking-tight text-gray-800">
              <span>Loading</span> <span className="text-indigo-500">Exam</span> <span>🎲</span>
            </Dialog.Title>
            <div className="h-16 w-16 animate-spin rounded-full border-2 border-gray-200 border-r-indigo-500" />
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
};

export default Loader;
