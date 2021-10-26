import useSWR, { useSWRConfig } from "swr";
import { NextPage } from "next";
import { FormEvent, useEffect, useState } from "react";
import { CheckIcon, XIcon } from "@heroicons/react/solid";

import { classNames } from "utils";

import Select from "components/Select";
import { LoadingIcon } from "components/CustomIcons";

const SubjectForm: NextPage = () => {
    const { mutate } = useSWRConfig();
    const [name, setName] = useState('');
    const [alias, setAlias] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState<boolean | undefined>();
    const { data: classes, error } = useSWR('/api/classes?select=name', url => fetch(url).then(res => res.json()));

    const [selectedClass, setSelectedClass] = useState({
        _id: "",
        name: "Select class"
    });

    useEffect(() => {
        setSelectedClass({
            _id: "",
            name: (error !== undefined && classes === undefined) ? "Error Loading Classes" : (classes === undefined ? "Loading classes..." : "Select class")
        });
    }, [classes, error]);

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch(`/api/classes/${selectedClass._id}/subjects`, {
                method: "POST",
                body: JSON.stringify({ name, alias })
            });
            const { success, message, data, error } = await res.json();

            setSuccess(success);

            if (success === true) {
                setName('');
                setAlias('');
                setSelectedClass({
                    _id: "",
                    name: "Select class"
                })
                setTimeout(setSuccess, 15e2, undefined);

                console.log({ message, data });
                mutate(`/api/classes/${selectedClass._id}/subjects`);
            } else throw new Error(error);
        } catch (error) {
            console.log({ error });
        }

        setLoading(false);
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-7 rounded-3xl shadow-lg p-8 bg-white"
        >
            <h1 className="text-4xl text-gray-800 font-bold tracking-tight text-center pb-4">
                <span>Create a</span>{' '}
                <span className="text-blue-500">Subject</span>
            </h1>
            <Select
                label="Classes"
                colorPallette={{
                    activeCheckIconColor: "text-blue-600",
                    inactiveCheckIconColor: "text-blue-800",
                    activeOptionColor: "text-blue-900 bg-blue-100",
                    buttonBorderColor: "focus-visible:border-blue-500",
                    buttonOffsetFocusColor: "focus-visible:ring-offset-blue-500"
                }}
                options={classes?.data}
                selected={selectedClass}
                handleChange={setSelectedClass}
            />
            <div className="flex flex-col gap-2.5 min-w-80 w-full">
                <label
                    htmlFor="name"
                    className="text-sm text-gray-600 font-semibold"
                >
                    Name
                </label>
                <input
                    required
                    id="name"
                    type="text"
                    value={name}
                    onChange={({ target: { value } }) => setName(value)}
                    className="border rounded-md transition-shadow focus:ring-2 focus:ring-blue-400 focus:outline-none p-3 pl-5"
                />
            </div>
            <div className="flex flex-col gap-2.5 min-w-80 w-full">
                <label
                    htmlFor="alias"
                    className="text-sm text-gray-600 font-semibold"
                >
                    Alias
                </label>
                <input
                    required
                    id="alias"
                    type="text"
                    value={alias}
                    onChange={({ target: { value } }) => setAlias(value)}
                    className="border rounded-md transition-shadow focus:ring-2 focus:ring-blue-400 focus:outline-none p-3 pl-5"
                />
            </div>
            <button
                type="submit"
                className={classNames("flex gap-4 items-center justify-center mt-3 py-2.5 px-3 rounded-md shadow-md text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2  focus:ring-offset-white", {
                    "bg-blue-400 hover:bg-blue-500 focus:ring-blue-500": success === undefined,
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
                Create Subject
            </button>
        </form>
    );
}

export default SubjectForm;
