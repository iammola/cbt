import useSWR from "swr";
import Head from "next/head";
import { NextPage } from "next";
import { FormEvent, useEffect, useState } from "react";
import { CheckIcon, XIcon } from "@heroicons/react/solid";

import { classNames } from "utils";
import Select from "components/Select";
import { LoadingIcon } from "components/Misc/CustomIcons";

const CreateStudents: NextPage = () => {
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [initials, setInitials] = useState('');
    const [lastName, setLastName] = useState('');
    const [firstName, setFirstName] = useState('');
    const [selectedClass, setSelectedClass] = useState({
        _id: "",
        name: "Select class"
    });
    const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

    const [subjects, setSubjects] = useState<{ _id: string; name: string; }[]>([]);
    const { data: classes, error } = useSWR('/api/classes?select=name', url => fetch(url).then(res => res.json()));

    const [subjectsLoadingState, setSubjectsLoadingState] = useState<boolean | undefined>();

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState<boolean | undefined>();

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/students', {
                method: "POST",
                body: JSON.stringify({
                    email,
                    name: { initials, fullName, lastName, firstName },
                    academic: {
                        class: selectedClass._id,
                        subjects: selectedSubjects
                    }
                })
            });
            const { success, error, message, data } = await res.json();

            setSuccess(success);

            if (success === true) {
                setEmail('');
                setFullName('');
                setInitials('');
                setLastName('');
                setFirstName('');
                setSelectedClass({
                    _id: "",
                    name: "Select class"
                })
                setSelectedSubjects([]);
            } else throw new Error(error);
        } catch (error) {
            console.log({ error });
        }

        setLoading(false);
        setTimeout(setSuccess, 15e2, undefined);
    }

    useEffect(() => {
        if (classes === undefined || error === undefined) setSelectedClass({
            _id: "",
            name: (error !== undefined && classes === undefined) ? "⚠️ Error Loading Classes" : (classes === undefined ? "Loading classes..." : "Select class")
        });
    }, [classes, error]);

    useEffect(() => {
        async function fetchSubjects() {
            setSubjects([]);
            setSelectedSubjects([]);
            setSubjectsLoadingState(true);

            try {
                const res = await fetch(`/api/classes/${selectedClass._id}/subjects`);
                const { success, data, error } = await res.json();

                if (success === true) {
                    setSubjects(data.subjects);
                    setSubjectsLoadingState(undefined);
                } else throw new Error(error);
            } catch (error) {
                console.log({ error });
                setSubjectsLoadingState(false);
            }
        }
        if (selectedClass._id !== "") fetchSubjects();
    }, [selectedClass]);

    return (
        <>
            <Head>
                <title>Create Student Profile | CBT | Grand Regal School</title>
                <meta name="description" content="Student Registration | GRS CBT" />
            </Head>
            <section className="flex items-center justify-center bg-gradient-to-tr from-blue-400 to-indigo-500 p-10 w-screen min-h-screen">
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-7 rounded-3xl shadow-lg p-8 bg-white"
                >
                    <h1 className="text-4xl text-gray-800 font-bold tracking-tight text-center pb-4">
                        <span>Create a</span>{' '}
                        <span className="text-indigo-500">Student Profile</span>
                    </h1>
                    <div className="flex flex-col gap-2.5 min-w-80 w-full">
                        <label
                            htmlFor="fullName"
                            className="text-sm text-gray-600 font-semibold"
                        >
                            Full Name
                        </label>
                        <input
                            required
                            type="text"
                            id="fullName"
                            value={fullName}
                            onChange={({ target: { value } }) => setFullName(value)}
                            className="border rounded-md transition-shadow focus:ring-2 focus:ring-indigo-400 focus:outline-none p-3 pl-5"
                        />
                    </div>
                    <div className="flex items-center justify-between gap-4 w-full">
                        <div className="flex flex-col gap-2.5">
                            <label
                                htmlFor="initials"
                                className="text-sm text-gray-600 font-semibold"
                            >
                                Initials
                            </label>
                            <input
                                required
                                type="text"
                                minLength={2}
                                maxLength={3}
                                id="initials"
                                value={initials}
                                onChange={({ target: { value } }) => setInitials(value)}
                                className="border rounded-md transition-shadow focus:ring-2 focus:ring-indigo-400 focus:outline-none p-3 pl-5"
                            />
                        </div>
                        <div className="flex flex-col gap-2.5">
                            <label
                                htmlFor="email"
                                className="text-sm text-gray-600 font-semibold"
                            >
                                E-mail
                            </label>
                            <input
                                required
                                id="email"
                                type="email"
                                value={email}
                                onChange={({ target: { value } }) => setEmail(value)}
                                className="border rounded-md transition-shadow focus:ring-2 focus:ring-indigo-400 focus:outline-none p-3 pl-5"
                            />
                        </div>
                    </div>
                    <div className="flex items-center justify-between gap-4 w-full">
                        <div className="flex flex-col gap-2.5">
                            <label
                                htmlFor="firstName"
                                className="text-sm text-gray-600 font-semibold"
                            >
                                First Name
                            </label>
                            <input
                                required
                                type="text"
                                id="firstName"
                                value={firstName}
                                onChange={({ target: { value } }) => setFirstName(value)}
                                className="border rounded-md transition-shadow focus:ring-2 focus:ring-indigo-400 focus:outline-none p-3 pl-5"
                            />
                        </div>
                        <div className="flex flex-col gap-2.5">
                            <label
                                htmlFor="lastName"
                                className="text-sm text-gray-600 font-semibold"
                            >
                                Last Name
                            </label>
                            <input
                                required
                                type="text"
                                id="lastName"
                                value={lastName}
                                onChange={({ target: { value } }) => setLastName(value)}
                                className="border rounded-md transition-shadow focus:ring-2 focus:ring-indigo-400 focus:outline-none p-3 pl-5"
                            />
                        </div>
                    </div>
                    <Select
                        label="Class"
                        colorPallette={{
                            activeCheckIconColor: "text-indigo-600",
                            inactiveCheckIconColor: "text-indigo-800",
                            activeOptionColor: "text-indigo-900 bg-indigo-100",
                            buttonBorderColor: "focus-visible:border-indigo-500",
                            buttonOffsetFocusColor: "focus-visible:ring-offset-indigo-500"
                        }}
                        options={classes?.data}
                        selected={selectedClass}
                        handleChange={setSelectedClass}
                    />
                    <div className="flex flex-col gap-2 5 min-w-80 w-full">
                        <span className="text-sm text-gray-600 font-semibold">
                            Subjects
                        </span>
                        <div className="flex gap-x-4 gap-y-3 w-full text-sm">
                            {subjects.map(({ _id, name }) => (
                                <label
                                    key={_id}
                                    htmlFor={_id}
                                    className="flex gap-3 p-2"
                                >
                                    <input
                                        id={_id}
                                        type="checkbox"
                                        checked={selectedSubjects.includes(_id)}
                                        onChange={({ target: { checked } }) => checked === true ? setSelectedSubjects([...selectedSubjects, _id]) : setSelectedSubjects(selectedSubjects.filter(selected => selected !== _id))}
                                    />
                                    {name}
                                </label>
                            ))}
                            <div className="w-full pt-2 text-center empty:hidden">
                                {subjectsLoadingState === undefined && subjects.length === 0 && (selectedClass._id !== "" ? (
                                    "No subjects linked to this class"
                                ) : classes !== undefined && (
                                    "Select a class ⬆️"
                                ))}
                                {subjectsLoadingState === false && "Error loading subjects. Change selected class to retry"}
                                {subjectsLoadingState === true && `Loading ${selectedClass.name}'s subjects...`}
                            </div>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className={classNames("flex gap-4 items-center justify-center mt-3 py-2.5 px-3 rounded-md shadow-md text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2  focus:ring-offset-white", {
                            "bg-indigo-400 hover:bg-indigo-500 focus:ring-indigo-500": success === undefined,
                            "bg-green-400 hover:bg-green-500 focus:ring-green-500": success === true,
                            "bg-red-400 hover:bg-red-500 focus:ring-red-500": success === false,
                        })}
                    >
                        {loading === true && (
                            <LoadingIcon className="animate-spin w-5 h-5" />
                        )}
                        {success === true && (
                            <CheckIcon className="w-5 h-5" />
                        )}
                        {success === false && (
                            <XIcon className="w-5 h-5" />
                        )}
                        Create Profile
                    </button>
                </form>
            </section>
        </>
    );
}

export default CreateStudents;
