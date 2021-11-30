import { Fragment, FunctionComponent } from "react";
import { Transition, Dialog } from "@headlessui/react";
import { CheckIcon, XIcon } from "@heroicons/react/solid";

import { LoadingIcon } from "components/Misc/Icons";

import type { StudentModalProps } from "types";

const Modal: FunctionComponent<StudentModalProps> = ({ forced, show, success, close, confirm }) => {
    return (
        <Transition show={show} appear as={Fragment}>
            <Dialog
                as="section"
                onClose={close}
                className="flex items-center justify-center fixed z-50 inset-0 h-screen w-full p-8 backdrop-blur-sm"
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
                    <Dialog.Overlay className="w-full h-full fixed z-[-1] inset-0 bg-black/30" />
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
                    <div className="flex flex-col gap-10 py-10 px-11 m-2 overflow-hidden transform transition-all rounded-2xl shadow-xl bg-white w-[65vw] lg:w-[42.5vw] xl:w-[35.5vw]">
                        <Dialog.Title className="text-4xl text-gray-900 font-bold tracking-tight text-center">
                            {forced === false ? (
                                <>
                                    <span>Are you sure you&apos;re <br /> ready to</span>{' '}
                                    <span className="text-blue-500">submit?</span>
                                </>
                            ) : (
                                <>
                                    <span>You&apos;ve</span>{' '}
                                    <span className="text-blue-500">used up</span>{' '}
                                    <span>the <br /> allowed time for this exam</span>
                                </>
                            )}
                        </Dialog.Title>
                        <div className="flex gap-6 item-center justify-center mt-2">
                            {forced === false && (
                                <button
                                    type="button"
                                    onClick={close}
                                    className="inline-flex justify-center px-4 py-3 text-sm font-medium text-gray-900 bg-gray-100 border border-transparent rounded-md shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                                >
                                    No, I&apos;m not ready
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={confirm}
                                className="inline-flex gap-3 justify-center px-5 py-3 text-sm font-medium tracking-wide text-white bg-blue-500 border border-transparent rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:pointer-events-none"
                            >
                                {success === -1 && (
                                    <LoadingIcon className="animate-spin w-5 h-5 stroke-sky-900" />
                                )}
                                {success === 1 && (
                                    <CheckIcon className="w-5 h-5 fill-sky-900" />
                                )}
                                {success === 0 && (
                                    <XIcon className="w-5 h-5 fill-sky-900" />
                                )}
                                {forced === false ? (
                                    <>
                                        Yes, I&apos;m ready
                                    </>
                                ) : (
                                    <>
                                        Submit Exam
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </Transition.Child>
            </Dialog>
        </Transition>
    );
}

export default Modal;
