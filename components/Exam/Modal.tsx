import useSWR from "swr";
import { useCookies } from "react-cookie";
import { Dialog, Transition } from "@headlessui/react";
import { FormEvent, Fragment, FunctionComponent, useEffect, useState } from "react";

import Select from "components/Select";

import type { ExamModalProps, SelectOption } from "types";

const ExamModal: FunctionComponent<ExamModalProps> = ({ isEdit, open, onSubmit }) => {
    const [{ account }] = useCookies(['account']);
    const [subjects, setSubjects] = useState<SelectOption[] | undefined>();
    const { data: classes, error } = useSWR(account !== undefined ? `/api/teachers/${account._id}/classes` : null, url => url !== null && fetch(url).then(res => res.json()));

    const [duration, setDuration] = useState(0);
    const [selectedClass, setSelectedClass] = useState({ _id: "", name: "Loading classes..." });
    const [selectedSubject, setSelectedSubject] = useState({ _id: "", name: "Select class first" });

    useEffect(() => {
        setSelectedClass({
            _id: "",
            name: (error !== undefined && classes === undefined) ? "Error Loading Classes" : (classes === undefined ? "Loading classes..." : "Select class")
        });
    }, [classes, error]);

    useEffect(() => {
        const { _id } = selectedClass;

        async function fetchSubjects() {
            setSelectedSubject({ _id: "", name: "Loading subjects..." });
            try {
                const res = await fetch(`/api/teachers/${account._id}/classes/${_id}/subjects`);
                const { success, data, error } = await res.json();

                if (success === true) {
                    setSubjects(data.subjects);
                    setSelectedSubject({ _id: "", name: "Select subject" });
                } else throw new Error(error);
            } catch (error: any) {
                console.log({ error });
            }
        }

        if (_id !== "") fetchSubjects();
    }, [account?._id, selectedClass]);

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (selectedClass._id !== "" && selectedSubject._id !== "") {
            onSubmit({
                class: selectedClass.name,
                subject: selectedSubject.name,
                details: {
                    duration,
                    SubjectID: selectedSubject._id as any
                },
            });
        }
    }

    return (
        <Transition show={open} appear as={Fragment}>
            <Dialog
                as="section"
                onClose={() => { }}
                className="flex items-center justify-center fixed z-10 inset-0 h-screen w-full"
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
                    enter="ease-out duration-300 transition"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-200 transition"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                >
                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-7 rounded-3xl shadow-lg p-8 bg-white w-full sm:w-[30rem]"
                    >
                        <Dialog.Title className="text-4xl text-gray-800 font-bold tracking-tight text-center pb-4">
                            <span>
                                {isEdit === true ? "Edit" : "Create"} an
                            </span>{' '}
                            <span className="text-indigo-500">Exam</span>{' '}
                            <span>🚀</span>
                        </Dialog.Title>
                        <Select
                            label="Classes"
                            options={classes?.data}
                            selected={selectedClass}
                            colorPallette={{
                                activeCheckIconColor: "text-indigo-600",
                                inactiveCheckIconColor: "text-indigo-800",
                                activeOptionColor: "text-indigo-900 bg-indigo-100",
                                buttonBorderColor: "focus-visible:border-indigo-500",
                                buttonOffsetFocusColor: "focus-visible:ring-offset-indigo-500"
                            }}
                            handleChange={setSelectedClass}
                        />
                        <Select
                            label="Subjects"
                            options={subjects}
                            selected={selectedSubject}
                            colorPallette={{
                                activeCheckIconColor: "text-indigo-600",
                                inactiveCheckIconColor: "text-indigo-800",
                                activeOptionColor: "text-indigo-900 bg-indigo-100",
                                buttonBorderColor: "focus-visible:border-indigo-500",
                                buttonOffsetFocusColor: "focus-visible:ring-offset-indigo-500"
                            }}
                            handleChange={setSelectedSubject}
                        />
                        <div className="flex flex-col gap-2.5 min-w-[20rem] w-full relative">
                            <label
                                htmlFor="duration"
                                className="text-sm text-gray-600 font-semibold"
                            >
                                Duration
                            </label>
                            <input
                                min={15}
                                step={1}
                                required
                                pattern="\d+"
                                id="duration"
                                type="number"
                                inputMode="numeric"
                                value={duration === 0 ? '' : duration}
                                onChange={({ target: { valueAsNumber } }) => setDuration(valueAsNumber)}
                                className="border rounded-md transition-shadow focus:ring-2 focus:ring-indigo-400 focus:outline-none p-3 pl-5"
                            />
                            <span className="absolute bottom-4 right-0 z-10 flex items-center pr-2 pointer-events-none text-gray-500 text-xs">
                                mins
                            </span>
                        </div>
                        <button
                            type="submit"
                            className="flex gap-4 items-center justify-center mt-7 py-2.5 px-3 rounded-md shadow-md text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2  focus:ring-offset-white bg-indigo-400 hover:bg-indigo-500 focus:ring-indigo-500"
                        >
                            Continue
                        </button>
                    </form>
                </Transition.Child>
            </Dialog>
        </Transition>
    );
}

export default ExamModal;
