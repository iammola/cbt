import { Fragment, FunctionComponent } from "react";
import { Transition, Dialog } from "@headlessui/react";

import type { StudentLoaderProps } from "types";

const Loader: FunctionComponent<StudentLoaderProps> = ({ show, start, exam }) => {
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
          <div className="flex w-full flex-col items-center gap-1 rounded-3xl bg-white p-12 shadow-lg sm:w-[50rem]">
            {exam === undefined ? (
              <>
                <Dialog.Title className="pb-4 text-center text-4xl font-bold tracking-tight text-gray-800">
                  <span>Loading</span> <span className="text-sky-500">Exam</span> <span>🎲</span>
                </Dialog.Title>
                <div className="mt-5 h-16 w-16 animate-spin rounded-full border-2 border-gray-200 border-r-sky-500" />
              </>
            ) : (
              <>
                <Dialog.Description className="text-center text-lg font-bold tracking-wider text-gray-600 ">
                  {exam.class}
                </Dialog.Description>
                <Dialog.Title className="pb-1 text-center text-4xl font-bold tracking-tight text-sky-500">
                  {exam.subject}
                </Dialog.Title>
                <div className="text-center text-sm font-semibold text-gray-500">
                  {exam.duration} minutes • {exam.questions} questions
                </div>
                <div className="flex w-full flex-col gap-2 pt-3 pb-5">
                  <h6 className="font-bold text-sky-500">Instructions</h6>
                  <ul className="flex w-full flex-col items-start justify-center gap-2">
                    {exam.instructions.map((instruction, i) => (
                      <li
                        key={instruction}
                        className="flex items-center justify-start gap-2"
                      >
                        <span className="text-xs font-bold text-gray-600">{i + 1}.</span>
                        <p className="text-sm font-medium text-gray-800">{instruction}</p>
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  onClick={start}
                  className="rounded-full bg-sky-400 px-8 py-3 text-sm text-white shadow-md hover:bg-sky-500 focus:outline-none"
                >
                  Start Exam
                </button>
              </>
            )}
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
};

export default Loader;
