import useSWR from "swr";
import Head from "next/head";
import type { NextPage } from "next";
import { addHours, format } from "date-fns";
import { FormEvent, useEffect, useState } from "react";
import { CheckIcon, XIcon } from "@heroicons/react/solid";

import { classNames } from "utils";
import Select from "components/Select";
import { LoadingIcon } from "components/Misc/Icons";

import type { SelectOption } from "types";

const CreateEvent: NextPage = () => {
    const [date, setDate] = useState<Date | null>(null);
    const [selectedClass, setSelectedClass] = useState({ _id: "", name: "Loading classes..." });
    const [selectedExam, setSelectedExam] = useState({ _id: "", name: "Select exam" });

    const [exams, setExams] = useState<SelectOption[]>();
    const { data: classes, error } = useSWR('/api/classes/?select=name', url => fetch(url).then(res => res.json()));

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState<boolean | undefined>();

    useEffect(() => {
        setSelectedClass({
            _id: "",
            name: (error !== undefined && classes === undefined) ? "Error Loading Classes" : (classes === undefined ? "Loading classes..." : "Select class")
        });
    }, [classes, error]);

    useEffect(() => {
        const { _id } = selectedClass;

        async function getExams() {
            setSelectedExam({ _id: "", name: "Loading exams..." });
            try {
                const res = await fetch(`/api/classes/${_id}/exams`);
                const { success, data, error } = await res.json();

                if (success === true) {
                    setExams(data.exams);
                    setSelectedExam({ _id: "", name: "Select exam" });
                } else throw new Error(error);
            } catch (error: any) {
                console.log({ error });
            }
        }

        if (_id !== "") getExams();
    }, [selectedClass]);

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (selectedClass._id !== "" && selectedExam._id !== "") {
            setLoading(true);

            try {
                const res = await fetch('/api/events/', {
                    method: "POST",
                    body: JSON.stringify({
                        date,
                        examId: selectedExam._id
                    })
                });

                const { success, error } = await res.json();

                setSuccess(success);

                if (success === true) {
                    setDate(null);
                    setSelectedClass({ _id: "", name: "Select class" });
                    setSelectedExam({ _id: "", name: "Select exam" });
                } else throw new Error(error);
            } catch (error: any) {
                console.log({ error });
            }

            setLoading(false);
            setTimeout(setSuccess, 15e2, undefined);
        }
    }

    return (
        <>
            <Head>
                <title>Create Event | CBT | Grand Regal School</title>
                <meta name="description" content="Event Registration | GRS CBT" />
            </Head>
            <section className="flex items-center justify-center bg-gradient-to-tr from-blue-400 to-purple-500 p-10 w-screen min-h-screen">
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-7 rounded-3xl shadow-lg p-8 bg-white"
                >
                    <h1 className="text-4xl text-gray-800 font-bold tracking-tight text-center pb-4">
                        <span>Create an</span>{' '}
                        <span className="text-violet-500">Event</span>
                    </h1>
                    <Select
                        label="Classes"
                        colorPallette={{
                            activeCheckIconColor: "stroke-violet-600",
                            inactiveCheckIconColor: "stroke-violet-800",
                            activeOptionColor: "text-violet-900 bg-violet-100",
                            buttonBorderColor: "focus-visible:border-purple-500",
                            buttonOffsetFocusColor: "focus-visible:ring-offset-purple-500"
                        }}
                        options={classes?.data}
                        selected={selectedClass}
                        handleChange={setSelectedClass}
                    />
                    <Select
                        label="Exams"
                        colorPallette={{
                            activeCheckIconColor: "stroke-violet-600",
                            inactiveCheckIconColor: "stroke-violet-800",
                            activeOptionColor: "text-violet-900 bg-violet-100",
                            buttonBorderColor: "focus-visible:border-purple-500",
                            buttonOffsetFocusColor: "focus-visible:ring-offset-purple-500"
                        }}
                        options={exams}
                        selected={selectedExam}
                        handleChange={setSelectedExam}
                    />
                    <div className="flex flex-col gap-2.5 w-full">
                        <label
                            htmlFor="date"
                            className="text-sm text-gray-600 font-semibold"
                        >
                            Event Date
                        </label>
                        <input
                            required
                            id="date"
                            type="datetime-local"
                            onChange={e => setDate(new Date(e.target.value))}
                            min={format(addHours(new Date(), 1), "yyyy-MM-dd'T'HH:mm")}
                            value={date === null ? '' : format(date, "yyyy-MM-dd'T'HH:mm")}
                            className="border rounded-md transition-shadow focus:ring-2 focus:ring-violet-400 focus:outline-none p-3 pl-5"
                        />
                    </div>
                    <button
                        type="submit"
                        className={classNames("flex gap-4 items-center justify-center mt-3 py-2.5 px-3 rounded-md shadow-md text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2  focus:ring-offset-white", {
                            "bg-violet-400 hover:bg-violet-500 focus:ring-violet-500": success === undefined,
                            "bg-emerald-400 hover:bg-emerald-500 focus:ring-emerald-500": success === true,
                            "bg-red-400 hover:bg-red-500 focus:ring-red-500": success === false,
                        })}
                    >
                        {loading === true && (
                            <LoadingIcon className="animate-spin w-5 h-5 stroke-white" />
                        )}
                        {success === true && (
                            <CheckIcon className="w-5 h-5 fill-white" />
                        )}
                        {success === false && (
                            <XIcon className="w-5 h-5 fill-white" />
                        )}
                        Create Event
                    </button>
                </form>
            </section>
        </>
    );
}

export default CreateEvent;
