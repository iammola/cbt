import useSWR from "swr";
import { NextPage } from "next";
import { FormEvent, useEffect, useState } from "react";

import Select from "components/Select";
import { LoadingIcon } from "components/CustomIcons";

const SubjectForm: NextPage = () => {
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
            name: error !== undefined ? "Error Loading Classes" : (classes === undefined ? "Loading classes..." : "Select class")
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
                setTimeout(setSuccess, 5e3, undefined);

                console.log({ message, data });
            } else throw new Error(error);
        } catch (error) {
            console.log({ error });
        }

        setLoading(false);
    }

    return (
        <>
            <form
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
                <div className="flex flex-col gap-2.5 w-80">
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
                <div className="flex flex-col gap-2.5 w-80">
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
                >
                    {loading === true && (
                        <LoadingIcon className="animate-spin w-5 h-5" />
                    )}
                    Create Subject
                </button>
            </form>
        </>
    );
}

export default SubjectForm;
