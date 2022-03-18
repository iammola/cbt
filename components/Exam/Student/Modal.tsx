import { Fragment, FunctionComponent } from "react";
import { Transition, Dialog } from "@headlessui/react";
import { CheckIcon, XIcon } from "@heroicons/react/solid";

import { LoadingIcon } from "components/Misc/Icons";

import type { StudentModalProps } from "types";

const Modal: FunctionComponent<StudentModalProps> = ({ forced, show, success, close, confirm }) => {
  return (
    <Transition
      appear
      show={show}
      as={Fragment}
    >
      <Dialog
        as="section"
        onClose={close}
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
          <div className="m-2 flex w-[65vw] transform flex-col gap-10 overflow-hidden rounded-2xl bg-white py-10 px-11 shadow-xl transition-all lg:w-[42.5vw] xl:w-[35.5vw]">
            <Dialog.Title className="text-center text-4xl font-bold tracking-tight text-gray-900">
              {!forced ? (
                <>
                  <span>
                    Are you sure you&apos;re <br /> ready to
                  </span>{" "}
                  <span className="text-blue-500">submit?</span>
                </>
              ) : (
                <>
                  <span>You&apos;ve</span> <span className="text-blue-500">used up</span>{" "}
                  <span>
                    your <br /> allocated time for this exam
                  </span>
                </>
              )}
            </Dialog.Title>
            <div className="item-center mt-2 flex justify-center gap-6">
              {!forced && (
                <button
                  type="button"
                  onClick={close}
                  className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-3 text-sm font-medium text-gray-900 shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                >
                  No, I&apos;m not ready
                </button>
              )}
              <button
                type="button"
                onClick={confirm}
                disabled={success === -1}
                className="inline-flex justify-center gap-3 rounded-md border border-transparent bg-blue-500 px-5 py-3 text-sm font-medium tracking-wide text-white shadow-sm hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:cursor-not-allowed"
              >
                {success === -1 && <LoadingIcon className="h-5 w-5 animate-spin stroke-white" />}
                {success === 1 && <CheckIcon className="h-5 w-5 fill-white" />}
                {success === 0 && <XIcon className="h-5 w-5 fill-white" />}
                {!forced ? <>Yes, I&apos;m ready</> : <>Submit Exam</>}
              </button>
            </div>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
};

export default Modal;
