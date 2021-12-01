import { FunctionComponent, Fragment } from "react";
import { Transition, Dialog } from "@headlessui/react";

const Loader: FunctionComponent<{ show: boolean }> = ({ show }) => {
    return (
        <Transition show={show} appear as={Fragment}>
            <Dialog
                as="section"
                onClose={() => { }}
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
                        <Dialog.Title className="text-4xl text-gray-800 font-bold tracking-tight text-center pb-4">
                            <span>Loading</span>{' '}
                            <span className="text-indigo-500">Exam</span>{' '}
                            <span>🎲</span>
                        </Dialog.Title>
                        <div
                            style={{ borderRightColor: 'rgb(99, 102, 241)' }}
                            className="w-16 h-16 rounded-full border-2 border-gray-200 animate-spin"
                        />
                    </div>
                </Transition.Child>
            </Dialog>
        </Transition>
    );
}

export default Loader;
