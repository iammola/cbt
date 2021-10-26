import Head from "next/head";
import { NextPage } from "next";
import { useState } from "react";

const CreateSession: NextPage = () => {
    const [name, setName] = useState('');
    const [alias, setAlias] = useState('');
    const [current, setCurrent] = useState(false);

    return (
        <>
            <Head>
                <title>Create a School Session // Term | CBT | Grand Regal School</title>
                <meta name="description" content="School Session // Term Registration | GRS CBT" />
            </Head>
            <section className="flex flex-col md:flex-row items-center justify-center gap-y-20 md:gap-y-0 gap-x-0 md:gap-x-10 p-10 w-screen min-h-screen">
                <form className="flex flex-col gap-7 rounded-3xl shadow-lg p-8 bg-white">
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
                            htmlFor="current"
                            className="flex gap-3 p-2"
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
                        className="flex gap-4 items-center justify-center mt-3 py-2.5 px-3 rounded-md shadow-md text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2  focus:ring-offset-white bg-yellow-400 hover:bg-yellow-500 focus:ring-yellow-500"
                    >
                        Create Class
                    </button>
                </form>
            </section>
        </>
    )
}

export default CreateSession;
