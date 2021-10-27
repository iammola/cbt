import useSWR from "swr";
import { format } from "date-fns";
import { Dialog, Transition } from "@headlessui/react";
import { CalendarIcon } from "@heroicons/react/solid";
import { FormEvent, Fragment, FunctionComponent, useEffect, useState } from "react";

import { ExamRecord } from "db/models/Exam";
import Select, { SelectOption } from "components/Select";


const ExamModal: FunctionComponent<ExamModalProps> = (props) => {
    const [subjects, setSubjects] = useState<SelectOption[] | undefined>();
    const { data: classes, error } = useSWR('/api/classes?select=name', url => fetch(url).then(res => res.json()));

    const [date, setDate] = useState(0);
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
                const res = await fetch(`/api/classes/${_id}/subjects`);
                const { success, data, message, error } = await res.json();

                if (success === true) {
                    setSubjects(data.subjects);
                    setSelectedSubject({ _id: "", name: "Select subject" });
                } else throw new Error(error);
            } catch (error) {
                console.log({ error });
            }
        }

        if (_id !== "") fetchSubjects();
    }, [selectedClass]);

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (selectedClass._id !== "" && selectedSubject._id !== "") {
            props.onSubmit({
                class: selectedClass.name,
                subject: selectedSubject.name,
                details: {
                    date, duration,
                    SubjectID: selectedSubject._id as any
                },
            });
        }
    }

    return (
        <Transition show appear as={Fragment}>
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
                        className="flex flex-col gap-3 py-6 px-10 overflow-hidden transform rounded-2xl shadow-xl bg-white"
                    >
                        <Dialog.Title className="text-lg text-center font-medium tracking-wide text-gray-800">
                            Exam
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
                        <div className="flex flex-col w-80 relative">
                            <label
                                htmlFor="date"
                                className="font-semibold text-sm text-gray-700"
                            >
                                Date
                            </label>
                            <input
                                required
                                id="date"
                                type="date"
                                value={date === 0 ? '' : format(new Date(date), 'yyyy-MM-dd')}
                                onChange={({ target: { valueAsNumber } }) => setDate(valueAsNumber)}
                                className="w-full mt-2 py-3.5 pl-3 pr-10 text-left sm:text-sm bg-white rounded-lg border transition-shadow focus:ring-2 focus:ring-green-400 focus:outline-none"
                            />
                            <span className="absolute bottom-4 right-0 z-10 flex items-center pr-2 pointer-events-none text-gray-400">
                                <CalendarIcon
                                    className="w-5 h-5"
                                    aria-hidden="true"
                                />
                            </span>
                        </div>
                        <div className="flex flex-col w-80 relative">
                            <label
                                htmlFor="duration"
                                className="font-semibold text-sm text-gray-700"
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
                                className="w-full mt-2 py-3.5 pl-3 pr-10 text-left sm:text-sm bg-white rounded-lg border transition-shadow focus:ring-2 focus:ring-green-400 focus:outline-none"
                            />
                            <span className="absolute bottom-4 right-0 z-10 flex items-center pr-2 pointer-events-none text-gray-400 text-sm">
                                in mins
                            </span>
                        </div>
                        <button
                            type="submit"
                            className="flex gap-4 items-center justify-center mt-7 py-2.5 px-3 rounded-md shadow-md text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2  focus:ring-offset-white bg-blue-400 hover:bg-blue-500 focus:ring-blue-500"
                        >
                            Continue
                        </button>
                    </form>
                </Transition.Child>
            </Dialog>
        </Transition>
    );
}

type ExamModalProps = {
    onSubmit(v: {
        class: string;
        subject: string;
        details: Omit<ExamRecord, 'questions'>;
    }): void
}

export default ExamModal;
