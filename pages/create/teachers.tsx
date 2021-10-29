import useSWR from "swr";
import Head from "next/head";
import { NextPage } from "next";
import { FormEvent, useEffect, useMemo, useState } from "react";

import Select from "components/Select";
import { ClassRecord, SubjectRecord } from "types";

const CreateTeachers: NextPage = () => {
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [initials, setInitials] = useState('');
    const [selectedTitle, setSelectedTitle] = useState({
        _id: "",
        name: "Select title"
    })

    const titleOptions = useMemo(() => ([{
        _id: "Mr.",
        name: "Mr."
    }, {
        _id: "Mrs.",
        name: "Mrs."
    }, {
        _id: "Ms.",
        name: "Ms."
    }, {
        _id: "Dr.",
        name: "Dr."
    }, {
        _id: "Master",
        name: "Master"
    }]), []);

    const { data: classes, error } = useSWR('/api/classes/?select=name', url => fetch(url).then(res => res.json()));

    const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
    const [subjectsData, setSubjectsData] = useState<{ _id: string; name: string; subjects: SubjectRecord<true>[]; }[] | string>('');

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState<boolean | undefined>();

    useEffect(() => {
        if (typeof subjectsData === 'string') {
            if (error !== undefined && classes === undefined) setSubjectsData("⚠️ Error loading subjects");
            else if (classes === undefined) setSubjectsData("Loading classes...");
            else setSubjectsData("Loading subjects...");
        }
    }, [classes, error, subjectsData]);

    useEffect(() => {
        async function fetchSubjects() {
            try {
                const data = await Promise.all((classes?.data as Pick<ClassRecord<true>, '_id' | 'name'>[]).map(async ({ _id, name }) => {
                    const res = await fetch(`/api/classes/${_id}/subjects`);
                    const { data } = await res.json();

                    return {
                        _id, name,
                        subjects: data.subjects as SubjectRecord<true>[]
                    };
                }));
                setSubjectsData(data.filter(({ subjects }) => subjects.length > 0));
            } catch (error) {
                console.log({ error });
            }
        }

        if (classes !== undefined) fetchSubjects();
    }, [classes]);

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/teachers', {
                method: "POST",
                body: JSON.stringify({
                    email,
                    name: { initials, fullName, lastName, firstName, title: selectedTitle._id },
                    subjects: selectedSubjects
                })
            });
            const { success, error, message, data } = await res.json();

            setSuccess(success);

            if (success === true) {
                console.log({ message, data });
            } else throw new Error(error);
        } catch (error) {
            console.log({ error });
        }

        setLoading(false);
        setTimeout(setSuccess, 15e2, undefined);
    }

    return (
        <>
            <Head>
                <title>Create Teacher Profile | CBT | Grand Regal School</title>
                <meta name="description" content="Teacher Registration | GRS CBT" />
            </Head>
            <section className="flex items-center justify-center bg-gradient-to-tr from-purple-400 to-pink-500 p-10 w-screen min-h-screen">
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-7 rounded-3xl shadow-lg p-8 bg-white"
                >
                    <h1 className="text-4xl text-gray-800 font-bold tracking-tight text-center pb-4">
                        <span>Create a</span>{' '}
                        <span className="text-pink-500">Teacher Profile</span>
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
                            className="border rounded-md transition-shadow focus:ring-2 focus:ring-pink-400 focus:outline-none p-3 pl-5"
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
                                className="border rounded-md transition-shadow focus:ring-2 focus:ring-pink-400 focus:outline-none p-3 pl-5"
                            />
                        </div>
                        <Select
                            label="Title"
                            options={titleOptions}
                            selected={selectedTitle}
                            handleChange={setSelectedTitle}
                            colorPallette={{
                                activeCheckIconColor: "text-pink-600",
                                inactiveCheckIconColor: "text-pink-800",
                                activeOptionColor: "text-pink-900 bg-pink-100",
                                buttonBorderColor: "focus-visible:border-pink-500",
                                buttonOffsetFocusColor: "focus-visible:ring-offset-pink-500"
                            }}
                        />
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
                                className="border rounded-md transition-shadow focus:ring-2 focus:ring-pink-400 focus:outline-none p-3 pl-5"
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
                                className="border rounded-md transition-shadow focus:ring-2 focus:ring-pink-400 focus:outline-none p-3 pl-5"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-2.5 min-w-80 w-full">
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
                            className="border rounded-md transition-shadow focus:ring-2 focus:ring-pink-400 focus:outline-none p-3 pl-5"
                        />
                    </div>
                    <div className="flex flex-col gap-2.5 min-w-80 w-full">
                        <span className="text-sm text-gray-600 font-semibold">
                            Subjects
                        </span>
                        <div className="flex flex-col gap-y-4 w-full">
                            {typeof subjectsData === "string" ? (
                                <span className="text-center text-sm">
                                    {subjectsData}
                                </span>
                            ) : (
                                subjectsData.length > 0 ? (
                                    subjectsData.map(({ _id, name, subjects }) => (
                                        <div
                                            key={_id}
                                            className="flex flex-col gap-2"
                                        >
                                            <span className="text-xs w-full font-medium text-gray-600">
                                                {name}
                                            </span>
                                            <div className="flex gap-x-4 gap-y-3 w-full text-sm text-gray-700">
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
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <span className="text-center text-sm">
                                        No subjects found
                                    </span>
                                )
                            )}
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="flex gap-4 items-center justify-center mt-3 py-2.5 px-3 rounded-md shadow-md text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2  focus:ring-offset-white bg-pink-400 hover:bg-pink-500 focus:ring-pink-500"
                    >
                        Create Profile
                    </button>
                </form>
            </section>
        </>
    );
}

export default CreateTeachers;
