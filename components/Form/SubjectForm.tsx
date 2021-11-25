import useSWR, { useSWRConfig } from "swr";
import type { NextPage } from "next";
import { FormEvent, useEffect, useState } from "react";
import { CheckIcon, XIcon } from "@heroicons/react/solid";

import { classNames } from "utils";

import Select from "components/Select";
import { LoadingIcon } from "components/Misc/Icons";

import type { RouteData, RouteError } from "types";
import type { ClassesGETData } from "types/api/classes";

const SubjectForm: NextPage = () => {
    const { mutate } = useSWRConfig();
    const [name, setName] = useState('');
    const [alias, setAlias] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState<boolean | undefined>();
    const { data: classes, error } = useSWR<RouteData<ClassesGETData>, RouteError>('/api/classes/?select=name', url => fetch(url).then(res => res.json()));

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

        if (selectedClass._id !== '') {
            try {
                const res = await fetch(`/api/classes/${selectedClass._id}/subjects/`, {
                    method: "POST",
                    body: JSON.stringify({ name, alias })
                });
                const { success, error } = await res.json();

                setSuccess(success);

                if (success === true) {
                    setName('');
                    setAlias('');
                    setSelectedClass({
                        _id: "",
                        name: "Select class"
                    });

                    mutate(`/api/classes/${selectedClass._id}/subjects`);
                } else throw new Error(error);
            } catch (error: any) {
                console.log({ error });
            }
        }

        setLoading(false);
        setTimeout(setSuccess, 15e2, undefined);
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
                    activeCheckIconColor: "stroke-blue-600",
                    inactiveCheckIconColor: "stroke-blue-800",
                    activeOptionColor: "text-blue-900 bg-blue-100",
                    buttonBorderColor: "focus-visible:border-blue-500",
                    buttonOffsetFocusColor: "focus-visible:ring-offset-blue-500"
                }}
                options={classes?.data}
                selected={selectedClass}
                handleChange={setSelectedClass}
            />
            <div className="flex flex-col gap-2.5 min-w-[20rem] w-full">
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
            <div className="flex flex-col gap-2.5 min-w-[20rem] w-full">
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
                Create Subject
            </button>
        </form>
    );
}

export default SubjectForm;
