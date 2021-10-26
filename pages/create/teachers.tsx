import Head from "next/head";
import { NextPage } from "next";

import Select from "components/Select";

const CreateTeachers: NextPage = () => {
    return (
        <>
            <Head>
                <title>Create Teacher Profile | CBT | Grand Regal School</title>
                <meta name="description" content="Teacher Registration | GRS CBT" />
            </Head>
            <section className="flex flex-col md:flex-row items-center justify-center gap-y-20 md:gap-y-0 gap-x-0 md:gap-x-10 p-10 w-screen min-h-screen">
                <form className="flex flex-col gap-7 rounded-3xl shadow-lg p-8 bg-white">
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
                                className="border rounded-md transition-shadow focus:ring-2 focus:ring-pink-400 focus:outline-none p-3 pl-5"
                            />
                        </div>
                        <Select
                            label="Title"
                            options={undefined}
                            selected={{ _id: "", name: "Select title" }}
                            handleChange={() => { }}
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
                            type="text"
                            id="email"
                            className="border rounded-md transition-shadow focus:ring-2 focus:ring-pink-400 focus:outline-none p-3 pl-5"
                        />
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
