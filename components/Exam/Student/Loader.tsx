import { Fragment, FunctionComponent } from "react";
import { Transition, Dialog } from "@headlessui/react";

import type { StudentLoaderProps } from "types";

const Loader: FunctionComponent<StudentLoaderProps> = ({ show, start, exam }) => {
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
                    <div className="flex flex-col items-center gap-1 rounded-3xl shadow-lg p-12 bg-white w-full sm:w-[50rem]">
                        {exam === undefined ? (
                            <>
                                <Dialog.Title className="text-4xl text-gray-800 font-bold tracking-tight text-center pb-4">
                                    <span>Loading</span>{' '}
                                    <span className="text-sky-500">Exam</span>{' '}
                                    <span>🎲</span>
                                </Dialog.Title>
                                <div
                                    style={{ borderRightColor: 'rgb(14, 165, 233)' }}
                                    className="w-16 h-16 rounded-full border-2 border-gray-200 animate-spin mt-5"
                                />
                            </>
                        ) : (
                            <>
                                <Dialog.Description className="text-lg text-gray-600 font-bold tracking-wider text-center ">
                                    {exam.class}
                                </Dialog.Description>
                                <Dialog.Title className="text-4xl text-sky-500 font-bold tracking-tight text-center pb-1">
                                    {exam.subject}
                                </Dialog.Title>
                                <div className="text-sm text-center font-semibold text-gray-500">
                                    {exam.duration} minutes • {exam.questions} questions
                                </div>
                                <div className="flex flex-col gap-2 pt-3 pb-5 w-full">
                                    <h6 className="text-sky-500 font-bold">
                                        Instructions
                                    </h6>
                                    <ul className="flex flex-col items-start justify-center gap-2 w-full">
                                        {exam.instructions.map((instruction, i) => (
                                            <li
                                                key={instruction}
                                                className="flex gap-2 items-center justify-start"
                                            >
                                                <span className="text-xs font-bold text-gray-600">
                                                    {i + 1}.
                                                </span>
                                                <p className="text-sm text-gray-800 font-medium">
                                                    {instruction}
                                                </p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <button
                                    onClick={start}
                                    className="shadow-md rounded-full text-sm text-white bg-sky-400 hover:bg-sky-500 px-8 py-3 focus:outline-none"
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
}

export default Loader;