import Head from "next/head";
import { NextPage } from "next";
import { useState } from "react";
import { XIcon } from "@heroicons/react/solid";

import Select from "components/Select";
import { useNotifications } from "components/Misc/Notification";

import type { ClassResultRecord } from "types";

type Fields = (Omit<ClassResultRecord['fields'][number], 'max'> & { max: number | ''; });
type Scheme = (Omit<ClassResultRecord['scheme'][number], 'limit'> & { limit: number | ''; });

const CreateScheme: NextPage = () => {
    const [addNotifications, , Notifications] = useNotifications();
    const [fields, setFields] = useState<Fields[]>([{
        name: '',
        alias: '',
        max: 0,
    }]);
    const [scheme, setScheme] = useState<Scheme[]>([{
        grade: "A",
        limit: 100,
        description: "Distinction",
    }]);

    return (
        <>
            <Head>
                <title>Create Scheme | Portal | Grand Regal School</title>
                <meta name="description" content="Create Scheme | GRS Portal" />
            </Head>
            <section className="flex items-center justify-center bg-gray-300 p-10 w-screen min-h-screen">
                <form className="flex flex-col gap-2 rounded-3xl shadow-lg p-8 bg-white" >
                    <h1 className="text-4xl text-gray-800 font-bold tracking-tight text-center pb-4">
                        <span>Create a</span>{' '}
                        <span className="text-stone-500">Result Setting</span>
                    </h1>
                    <Select
                        label="Class"
                        options={undefined}
                        selected={{ name: 'Select class', _id: '' }}
                        colorPallette={{
                            activeCheckIconColor: "stroke-indigo-600",
                            inactiveCheckIconColor: "stroke-indigo-800",
                            activeOptionColor: "text-indigo-900 bg-indigo-100",
                            buttonBorderColor: "focus-visible:border-indigo-500",
                            buttonOffsetFocusColor: "focus-visible:ring-offset-indigo-500"
                        }}
                        handleChange={() => { }}
                    />
                    <div className="flex flex-col gap-3 items-start justify-start w-full py-2">
                        <span className="text-sm text-gray-600 font-semibold" >
                            Marking Scheme
                        </span>
                        {scheme.map((s, p, a) => (
                            <div
                                key={s.limit}
                                className="flex items-center justify-start gap-2 w-full"
                            >
                                <input
                                    required
                                    type="text"
                                    value={s.grade}
                                    placeholder="Grade"
                                    onChange={e => setScheme(a.map((s, j) => j === p ? { ...s, grade: e.target.value } : s))}
                                    className="w-14 p-2 text-xs text-gray-700 text-center font-bold border border-gray-200 rounded-md focus:border-none"
                                />
                                <input
                                    required
                                    type="text"
                                    value={s.description}
                                    placeholder="Description"
                                    onChange={e => setScheme(a.map((s, j) => j === p ? { ...s, description: e.target.value } : s))}
                                    className="flex-grow p-2 text-sm text-gray-700 border border-gray-200 rounded-md focus:border-none"
                                />
                                <input
                                    required
                                    max={100}
                                    type="number"
                                    value={s.limit}
                                    placeholder="Upper Limit"
                                    onChange={e => setScheme(a.map((s, j) => j === p ? { ...s, limit: +e.target.value } : s))}
                                    className="w-14 p-2 text-xs text-gray-700 text-center font-bold border border-gray-200 rounded-md focus:border-none"
                                />
                                {a.length > 1 && (
                                    <span
                                        onClick={() => setScheme(a.filter((_, i) => i !== p))}
                                        className="flex items-center justify-center rounded-full hover:bg-gray-100 p-2 cursor-pointer"
                                    >
                                        <XIcon className="w-5 h-5 fill-gray-600" />
                                    </span>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => setScheme([...scheme, { grade: "", description: '', limit: '' }])}
                            className="flex gap-4 items-center justify-center mt-2 py-1.5 px-5 rounded-full shadow-md text-sm text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2  focus:ring-offset-white bg-stone-400 hover:bg-stone-500 focus:ring-stone-500"
                        >
                            Add Scheme
                        </button>
                    </div>
                    <div className="flex flex-col gap-3 items-start justify-start w-full py-2">
                        <span className="text-sm text-gray-600 font-semibold" >
                            Result Fields
                        </span>
                        {fields.map((f, b, a) => (
                            <div
                                key={b}
                                className="flex items-center justify-start gap-2 w-full"
                            >
                                <input
                                    required
                                    type="text"
                                    value={f.name}
                                    placeholder="Name"
                                    onChange={e => setFields(a.map((s, j) => j === b ? { ...s, name: e.target.value } : s))}
                                    className="flex-grow p-2 text-sm text-gray-700 border border-gray-200 rounded-md focus:border-none"
                                />
                                <input
                                    required
                                    type="text"
                                    value={f.alias}
                                    placeholder="Alias"
                                    onChange={e => setFields(a.map((s, j) => j === b ? { ...s, alias: e.target.value } : s))}
                                    className="flex-grow p-2 text-sm text-gray-700 border border-gray-200 rounded-md focus:border-none"
                                />
                                <input
                                    min={0}
                                    required
                                    type="number"
                                    value={f.max}
                                    placeholder="Max"
                                    onChange={e => setFields(a.map((s, j) => j === b ? { ...s, max: +e.target.value } : s))}
                                    className="w-14 p-2 text-xs text-gray-700 text-center font-bold border border-gray-200 rounded-md focus:border-none"
                                />
                                {a.length > 1 && (
                                    <span
                                        onClick={() => setFields(a.filter((_, i) => i !== b))}
                                        className="flex items-center justify-center rounded-full hover:bg-gray-100 p-2 cursor-pointer"
                                    >
                                        <XIcon className="w-5 h-5 fill-gray-600" />
                                    </span>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => setFields([...fields, { name: "", alias: "", max: '' }])}
                            className="flex gap-4 items-center justify-center mt-2 py-1.5 px-5 rounded-full shadow-md text-sm text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2  focus:ring-offset-white bg-stone-400 hover:bg-stone-500 focus:ring-stone-500"
                        >
                            Add Field
                        </button>
                    </div>
                    <button
                        type="submit"
                        className="flex gap-4 items-center justify-center mt-3 py-2.5 px-3 rounded-md shadow-md text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2  focus:ring-offset-white bg-stone-400 hover:bg-stone-500 focus:ring-stone-500"
                    >
                        Create Result Setting
                    </button>
                </form>
                {Notifications}
            </section>
        </>
    );
}

export default CreateScheme;
