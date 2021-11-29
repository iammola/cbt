import { Fragment, FunctionComponent } from "react";
import { Transition, Dialog } from "@headlessui/react";

const Modal: FunctionComponent<{ show: boolean; close(): void; confirm(): void }> = ({ show, close, confirm }) => {
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
                    <div className="flex flex-col items-center gap-7 rounded-3xl shadow-lg p-12 bg-white w-full sm:w-[50rem]">
                        <Dialog.Title className="text-4xl text-gray-900 font-bold tracking-tight text-center">
                            <span>Are you sure you want to</span>{' '}
                            <span className="text-blue-500">submit?</span>
                        </Dialog.Title>
                        <div className="flex gap-5 item-center justify-end mt-2">
                            <button
                                type="button"
                                onClick={confirm}
                                className="inline-flex justify-center px-4 py-2 text-xs font-medium text-rose-900 bg-rose-100 border border-transparent rounded-md hover:bg-rose-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
                            >
                                Submit
                            </button>
                            <button
                                type="button"
                                onClick={close}
                                className="inline-flex justify-center px-4 py-2 text-xs font-medium text-gray-900 bg-gray-100 border border-transparent rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </Transition.Child>
            </Dialog>
        </Transition>
    );
}

export default Modal;
