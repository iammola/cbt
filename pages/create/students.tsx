import Head from "next/head";
import { NextPage } from "next";
import { useEffect, useState } from "react";

import Select from "components/Select";
import useSWR from "swr";

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
                const { success, message, data, error } = await res.json();

                if (success === true) {
                    setSubjects(data.subjects);
                    setSubjectsLoadingState(undefined);
                    console.log({ message, data });
                } else throw new Error(error);
            } catch (error) {
                console.log({ error });
                setSubjectsLoadingState(false);
            }
        }
        if (selectedClass._id !== "") fetchSubjects();
    }, [selectedClass])

    return (
        <>
            <Head>
                <title>Create Student Profile | CBT | Grand Regal School</title>
                <meta name="description" content="Student Registration | GRS CBT" />
            </Head>
            <section className="flex flex-col md:flex-row items-center justify-center gap-y-20 md:gap-y-0 gap-x-0 md:gap-x-10 p-10 w-screen min-h-screen">
                <form className="flex flex-col gap-7 rounded-3xl shadow-lg p-8 bg-white">
                    <h1 className="text-4xl text-gray-800 font-bold tracking-tight text-center pb-4">
                        <span>Create a</span>{' '}
                        <span className="text-purple-500">Student Profile</span>
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
                            className="border rounded-md transition-shadow focus:ring-2 focus:ring-purple-400 focus:outline-none p-3 pl-5"
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
                                id="initials"
                                value={initials}
                                onChange={({ target: { value } }) => setInitials(value)}
                                className="border rounded-md transition-shadow focus:ring-2 focus:ring-purple-400 focus:outline-none p-3 pl-5"
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
                                className="border rounded-md transition-shadow focus:ring-2 focus:ring-purple-400 focus:outline-none p-3 pl-5"
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
                                className="border rounded-md transition-shadow focus:ring-2 focus:ring-purple-400 focus:outline-none p-3 pl-5"
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
                                className="border rounded-md transition-shadow focus:ring-2 focus:ring-purple-400 focus:outline-none p-3 pl-5"
                            />
                        </div>
                    </div>
                    <Select
                        label="Class"
                        colorPallette={{
                            activeCheckIconColor: "text-purple-600",
                            inactiveCheckIconColor: "text-purple-800",
                            activeOptionColor: "text-purple-900 bg-purple-100",
                            buttonBorderColor: "focus-visible:border-purple-500",
                            buttonOffsetFocusColor: "focus-visible:ring-offset-purple-500"
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
                        className="flex gap-4 items-center justify-center mt-3 py-2.5 px-3 rounded-md shadow-md text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2  focus:ring-offset-white bg-purple-400 hover:bg-purple-500 focus:ring-purple-500"
                    >
                        Create Profile
                    </button>
                </form>
            </section>
        </>
    );
}

export default CreateStudents;
