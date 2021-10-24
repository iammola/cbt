import useSWR from "swr";
import { NextPage } from "next";
import { format } from "date-fns";
import { Listbox, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState, FunctionComponent } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline';
import { CalendarIcon, CheckIcon, SelectorIcon, PlusSmIcon } from '@heroicons/react/solid';

import { classNames } from "utils";

import type { ClassRecord } from "db/models/Class";
import { CircleIcon, LineIcon } from "components/CustomIcons";

type SelectOption = Pick<ClassRecord<true>, '_id' | 'name'>;

const Register: NextPage = () => {
    const [subjects, setSubjects] = useState<SelectOption[] | undefined>();
    const { data: classes, error } = useSWR<SelectOption[], true>('/api/classes?select=name', url => fetch(url).then(res => res.json()));

    const [selectedDate, setSelectedDate] = useState<number | undefined>();
    const [selectedDuration, setSelectedDuration] = useState<number | undefined>();
    const [selectedClass, setSelectedClass] = useState<SelectOption>({ _id: "", name: "Loading classes..." });
    const [selectedSubject, setSelectedSubject] = useState<SelectOption>({ _id: "", name: "Select class first" });

    useEffect(() => {
        setSelectedClass({
            _id: "",
            name: error !== undefined ? "Error Loading Classes" : (classes === undefined ? "Loading classes..." : "Select class")
        });
    }, [classes, error]);

    useEffect(() => {
        const { _id } = selectedClass;
        if (_id !== "") {
            setSelectedSubject({ _id: "", name: "Loading subjects..." });
            fetch(`/api/classes/${_id}/subjects`).then(res => res.json()).then(subjects => {
                setSubjects(subjects);
                setSelectedSubject({ _id: "", name: "Select a subject" });
            });
        }
    }, [selectedClass]);

    return (
        <section className="flex flex-col">
            <section className="flex flex-col items-center justify-start gap-10 w-screen h-screen p-10">
                <div className="flex items-center justify-between gap-6 w-full">
                    <button className="p-1.5 rounded-md shadow-md bg-gray-200 focus:outline-none">
                        <ChevronLeftIcon className="w-6 h-6 text-blue-700" />
                    </button>
                    <span className="flex-grow text-left block truncate">
                        Q. 2 - Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione, dignissimos?
                    </span>
                    <button className="p-1.5 rounded-md shadow-md bg-gray-200 focus:outline-none">
                        <ChevronRightIcon className="w-6 h-6 text-blue-700" />
                    </button>
                </div>
                <div className="flex flex-col gap-20  relative w-full">
                    <div className="flex flex-col lg:flex-row items-start gap-y-2 lg:gap-y-0 gap-x-0 lg:gap-x-6 pl-[34px]">
                        <span className="absolute left-0 z-0 flex flex-col items-center justify-start w-[22px] h-[calc(100%+2px)] pt-1.5">
                            <CircleIcon className="drop-shadow-2xl text-gray-800 flex-shrink-0" />
                            <LineIcon className="flex-grow text-gray-800 -mt-1" />
                        </span>
                        <span className="w-max font-medium">
                            Choose Question Type:
                        </span>
                        <Select
                            handleChange={() => { }}
                            selected={{
                                _id: "Multiple Choice",
                                name: "Multiple Choice single answer"
                            }}
                            options={[{
                                _id: "Multiple Choice",
                                name: "Multiple Choice single answer"
                            }, {
                                _id: "Checkboxes",
                                name: "Multiple Choice multiple answer"
                            }, {
                                _id: "Short Answer",
                                name: "Short Answer"
                            }, {
                                _id: "Long Answer",
                                name: "Long Answer"
                            }]}
                        />
                    </div>
                    <div className="flex flex-col items-start gap-6 pl-[34px]">
                        <span className="absolute left-0 z-0 flex flex-col items-center justify-start w-[22px] h-[calc(100%+2px)] pt-2">
                            <CircleIcon className="drop-shadow-2xl text-gray-800 flex-shrink-0" />
                        </span>
                        <span className="w-max font-medium">
                            Question:
                        </span>
                        <div className="flex flex-col items-start justify-start gap-7 w-full">
                            <input
                                type="text"
                                className="w-full py-4 pl-8 pr-10 rounded-lg border border-gray-300"
                            />
                            <ul className="flex flex-col items-start justify-start gap-5 w-full pl-6 pr-4 md:pr-8 xl:pr-14 2xl:pr-20">
                                <li className="flex items-center justify-start gap-4 w-full">
                                    <span className="w-4 h-4 rounded-full border border-gray-500 flex-shrink-0"></span>
                                    <span className="">
                                        A.
                                    </span>
                                    <input
                                        type="text"
                                        className="w-full py-3 pl-5 rounded-lg border border-gray-300"
                                    />
                                </li>
                                <li className="flex items-center justify-start gap-4 w-full">
                                    <span className="w-4 h-4 rounded-full border border-gray-500 flex-shrink-0"></span>
                                    <span className="">
                                        B.
                                    </span>
                                    <input
                                        type="text"
                                        className="w-full py-3 pl-5 rounded-lg border border-gray-300"
                                    />
                                </li>
                                <li className="flex items-center justify-start gap-4 w-full">
                                    <span className="w-4 h-4 rounded-full border border-gray-500 flex-shrink-0"></span>
                                    <span className="">
                                        C.
                                    </span>
                                    <input
                                        type="text"
                                        className="w-full py-3 pl-5 rounded-lg border border-gray-300"
                                    />
                                </li>
                            </ul>
                            <button className="flex items-center gap-5 ml-10 py-3 px-4 rounded-md transition-shadow hover:ring-2 hover:ring-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <span className="p-2 rounded-full bg-blue-600">
                                    <PlusSmIcon className="w-5 h-5 text-white" />
                                </span>
                                Add Option
                            </button>
                        </div>
                    </div>
                </div>
            </section>
            <section className="flex flex-col items-center justify-center w-screen h-screen">
                <section className="flex flex-col gap-5 rounded-2xl shadow-lg p-10 bg-gray-50">
                    <h2 className="text-2xl text-gray-800 text-center tracking-white font-extrabold">
                        Registration
                    </h2>
                    <form className="flex flex-col gap-3 w-full">
                        <Select
                            label="Classes"
                            options={classes}
                            selected={selectedClass}
                            handleChange={setSelectedClass}
                        />
                        <Select
                            label="Subjects"
                            options={subjects}
                            selected={selectedSubject}
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
                                onChange={({ target: { valueAsNumber } }) => setSelectedDate(valueAsNumber)}
                                value={selectedDate !== undefined ? format(new Date(selectedDate), 'yyyy-MM-dd') : ''}
                                className="w-full mt-2 py-3.5 pl-3 pr-10 text-left sm:text-sm bg-white rounded-lg shadow-md transition-shadow focus:ring-2 focus:ring-green-400 focus:outline-none"
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
                                required
                                id="duration"
                                type="number"
                                value={selectedDuration ?? ''}
                                onChange={({ target: { valueAsNumber } }) => setSelectedDuration(valueAsNumber)}
                                className="w-full mt-2 py-3.5 pl-3 pr-10 text-left sm:text-sm bg-white rounded-lg shadow-md transition-shadow focus:ring-2 focus:ring-green-400 focus:outline-none"
                            />
                            <span className="absolute bottom-4 right-0 z-10 flex items-center pr-2 pointer-events-none text-gray-400 text-sm">
                                in mins
                            </span>
                        </div>
                        <button
                            type="submit"
                            className="flex gap-4 items-center justify-center mt-5 py-2.5 px-3 rounded-md shadow-md text-white bg-blue-400 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-white"
                        >
                            Next
                        </button>
                    </form>
                </section>
            </section>
        </section >
    );
}

const Select: FunctionComponent<SelectProps> = ({ label, options, selected, handleChange }) => {
    return (
        <div className="flex flex-col w-80 relative">
            <Listbox value={selected} onChange={handleChange}>
                <div className="relative mt-1">
                    {label !== undefined && (
                        <Listbox.Label className="font-semibold text-sm text-gray-700">
                            {label}
                        </Listbox.Label>
                    )}
                    <Listbox.Button className="relative w-full mt-2 py-3.5 pl-3 pr-10 text-left sm:text-sm bg-white rounded-lg border shadow-sm cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-yellow-500 focus-visible:ring-offset-2 focus-visible:border-indigo-500">
                        <span className="block truncate">{selected.name}</span>
                        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none text-gray-400">
                            <SelectorIcon
                                className="w-5 h-5"
                                aria-hidden="true"
                            />
                        </span>
                    </Listbox.Button>
                    {options !== undefined && (
                        <Transition
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Listbox.Options className="absolute z-20 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                {options.map(option => (
                                    <Listbox.Option
                                        key={option._id}
                                        value={option}
                                        className={({ active }) => classNames("cursor-default select-none relative py-2 pl-10 pr-4", {
                                            "text-yellow-900 bg-yellow-100": active,
                                            "text-gray-900": !active
                                        })}
                                    >
                                        {({ selected, active }) => (
                                            <>
                                                <span className={classNames("block truncate", {
                                                    "font-medium": selected,
                                                    "font-normal": !selected,
                                                })}>
                                                    {option.name}
                                                </span>
                                                {selected && (
                                                    <span className={classNames("absolute inset-y-0 left-0 flex items-center pl-3", {
                                                        "text-yellow-600": active,
                                                        "text-yellow-800": !active
                                                    })} >

                                                        <CheckIcon className="w-5 h-5" aria-hidden="true" />
                                                    </span>
                                                )}
                                            </>
                                        )}
                                    </Listbox.Option>
                                ))}
                            </Listbox.Options>
                        </Transition>
                    )}
                </div>
            </Listbox>
        </div>
    );
}

type SelectProps = {
    label?: string;
    selected: SelectOption;
    options?: SelectProps['selected'][];
    handleChange(T: SelectProps['selected']): void;
}

export default Register;
