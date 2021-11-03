import Head from "next/head";
import type { NextPage } from "next";
import { CheckIcon, XIcon } from "@heroicons/react/solid";
import { useState, FormEvent, useMemo, useEffect } from "react";

import { classNames } from "utils";
import { LoadingIcon } from "components/Misc/Icons";

const CreateSession: NextPage = () => {
    const termTemplate = useMemo(() => ({
        name: "",
        alias: "",
    }), []);
    const [name, setName] = useState('');
    const [alias, setAlias] = useState('');
    const [current, setCurrent] = useState(false);
    const [terms, setTerms] = useState<{ name: string; alias: string; current?: boolean; }[]>([{ ...termTemplate }]);

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState<boolean | undefined>();

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/sessions/', {
                method: "POST",
                body: JSON.stringify({ name, alias, current, terms })
            });
            const { success, error } = await res.json();

            setSuccess(success);

            if (success === true) {
                setName('');
                setAlias('');
                setCurrent(false);
                setTerms([{ ...termTemplate }]);
            } else throw new Error(error);
        } catch (error) {
            console.log({ error });
        }

        setLoading(false);
        setTimeout(setSuccess, 15e2, undefined);
    }

    useEffect(() => {
        if (current === true && terms.every(term => !!term.current === false)) setTerms(terms => [{ ...terms[0], current }, ...terms.slice(1)]);
        if (current === false && terms.some(term => term.current === true)) setTerms(terms => terms.map(term => ({ ...term, current })));
    }, [current, terms]);

    return (
        <>
            <Head>
                <title>Create a School Session // Term | CBT | Grand Regal School</title>
                <meta name="description" content="School Session // Term Registration | GRS CBT" />
            </Head>
            <section className="flex items-center justify-center bg-gradient-to-tr from-yellow-400 to-pink-500 p-10 w-screen min-h-screen">
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-7 rounded-3xl shadow-lg p-8 bg-white"
                >
                    <h1 className="text-4xl text-gray-800 font-bold tracking-tight text-center pb-4">
                        <span>Create a</span>{' '}
                        <span className="text-yellow-500">Session</span>
                    </h1>
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
                            className="border rounded-md transition-shadow focus:ring-2 focus:ring-yellow-400 focus:outline-none p-3 pl-5"
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
                            className="border rounded-md transition-shadow focus:ring-2 focus:ring-yellow-400 focus:outline-none p-3 pl-5"
                        />
                    </div>
                    <div className="flex flex-col gap-2.5 min-w-80 w-full">
                        <label
                            htmlFor="alias"
                            className="text-sm text-gray-600 font-semibold"
                        >
                            Terms
                        </label>
                        {terms.map((term, termIdx) => (
                            <div
                                key={termIdx}
                                className="flex flex-wrap gap-3 items-center justify-start"
                            >
                                <input
                                    required
                                    type="text"
                                    placeholder="Name"
                                    value={term.name}
                                    onChange={({ target: { value } }) => setTerms(terms.map((term, i) => i === termIdx ? ({ ...term, name: value }) : term))}
                                    className="border rounded-md transition-shadow focus:ring-2 focus:ring-yellow-400 focus:outline-none p-3 pl-5"
                                />
                                <input
                                    required
                                    type="text"
                                    placeholder="Alias"
                                    value={term.alias}
                                    onChange={({ target: { value } }) => setTerms(terms.map((term, i) => i === termIdx ? ({ ...term, alias: value }) : term))}
                                    className="border rounded-md transition-shadow focus:ring-2 focus:ring-yellow-400 focus:outline-none p-3 pl-5"
                                />
                                <label
                                    htmlFor={`Term${termIdx}`}
                                    className="flex items-center flex-shrink-0 gap-3 p-2 text-sm"
                                >
                                    <input
                                        type="checkbox"
                                        id={`Term${termIdx}`}
                                        checked={term.current ?? false}
                                        onChange={({ target: { checked } }) => setTerms(terms.map((term, i) => ({ ...term, current: current === true && i === (checked === true ? termIdx : 0) })))}
                                    />
                                    Mark as active term
                                </label>
                                {terms.length > 1 && (
                                    <span
                                        onClick={() => setTerms(terms.filter((_, i) => i !== termIdx))}
                                        className="p-1 rounded-full hover:bg-gray-300 text-gray-500 hover:text-gray-600"
                                    >
                                        <XIcon className="w-4 h-4" />
                                    </span>
                                )}
                            </div>
                        ))}
                        <span
                            onClick={() => setTerms([...terms, { ...termTemplate }])}
                            className="cursor-pointer w-max text-xs text-blue-400 hover:text-blue-500 hover:underline"
                        >
                            Add Term
                        </span>
                    </div>
                    <div className="flex min-w-80 w-full">
                        <label
                            htmlFor="current"
                            className="flex items-center gap-3 p-2 w-full"
                        >
                            <input
                                id="current"
                                type="checkbox"
                                checked={current}
                                onChange={({ target: { checked } }) => setCurrent(checked)}
                            />
                            Mark as active session
                        </label>
                    </div>
                    <button
                        type="submit"
                        className={classNames("flex gap-4 items-center justify-center mt-3 py-2.5 px-3 rounded-md shadow-md text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2  focus:ring-offset-white", {
                            "bg-yellow-400 hover:bg-yellow-500 focus:ring-yellow-500": success === undefined,
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
                        Create Session
                    </button>
                </form>
            </section>
        </>
    )
}

export default CreateSession;
