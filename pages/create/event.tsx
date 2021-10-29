import Head from "next/head";
import { NextPage } from "next";

import Select from "components/Select";

const CreateEvent: NextPage = () => {
    return (
        <>
            <Head>
                <title>Create Event | CBT | Grand Regal School</title>
                <meta name="description" content="Event Registration | GRS CBT" />
            </Head>
            <section className="flex flex-col items-center justify-center gap-2 w-screen">
                <form className="flex flex-col gap-7 rounded-3xl shadow-lg p-8 bg-white">
                    <h1 className="text-4xl text-gray-800 font-bold tracking-tight text-center pb-4">
                        <span>Create an</span>{' '}
                        <span className="text-purple-500">Event</span>
                    </h1>
                    <Select
                        label="Classes"
                        colorPallette={{
                            activeCheckIconColor: "text-purple-600",
                            inactiveCheckIconColor: "text-purple-800",
                            activeOptionColor: "text-purple-900 bg-purple-100",
                            buttonBorderColor: "focus-visible:border-purple-500",
                            buttonOffsetFocusColor: "focus-visible:ring-offset-purple-500"
                        }}
                        options={undefined}
                        selected={{ _id: "", name: "Select a Class" }}
                        handleChange={() => { }}
                    />
                    <Select
                        label="Subjects"
                        colorPallette={{
                            activeCheckIconColor: "text-purple-600",
                            inactiveCheckIconColor: "text-purple-800",
                            activeOptionColor: "text-purple-900 bg-purple-100",
                            buttonBorderColor: "focus-visible:border-purple-500",
                            buttonOffsetFocusColor: "focus-visible:ring-offset-purple-500"
                        }}
                        options={undefined}
                        selected={{ _id: "", name: "Select a Subject" }}
                        handleChange={() => { }}
                    />
                    <div className="flex items-center justify-between gap-4 w-full">
                        <div className="flex flex-col gap-2.5">
                            <label
                                htmlFor="name"
                                className="text-sm text-gray-600 font-semibold"
                            >
                                Event Name
                            </label>
                            <input
                                required
                                id="name"
                                type="text"
                                className="border rounded-md transition-shadow focus:ring-2 focus:ring-purple-400 focus:outline-none p-3 pl-5"
                            />
                        </div>
                        <div className="flex flex-col gap-2.5">
                            <label
                                htmlFor="date"
                                className="text-sm text-gray-600 font-semibold"
                            >
                                Event Date
                            </label>
                            <input
                                required
                                id="date"
                                type="date"
                                className="border rounded-md transition-shadow focus:ring-2 focus:ring-purple-400 focus:outline-none p-3 pl-5"
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="flex gap-4 items-center justify-center mt-3 py-2.5 px-3 rounded-md shadow-md text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2  focus:ring-offset-white bg-purple-400 hover:bg-purple-500 focus:ring-purple-500"
                    >
                        Create Event
                    </button>
                </form>
            </section>
        </>
    );
}

export default CreateEvent;
