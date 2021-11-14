import Head from "next/head";
import { NextPage } from "next";
import { CheckIcon, ChevronRightIcon } from "@heroicons/react/solid";

import { classNames } from "utils";

const WriteExam: NextPage = () => {
    const dummy = [
        { active: false, selected: true },
        { active: false },
        { active: false, selected: true },
        { active: false, selected: true },
        { active: false, selected: true },
        { active: false },
        { active: false },
        { active: false, selected: true },
        { active: true },
        { active: false, selected: true },
        { active: false },
        { active: false },
        { active: false },
        { active: false },
        { active: false, selected: true },
        { active: false, selected: true },
        { active: false },
        { active: false },
        { active: false, selected: true },
        { active: false, selected: true },
        { active: false, selected: true },
        { active: false },
        { active: false },
        { active: false, selected: true },
        { active: false, selected: true },
        { active: false, selected: true },
        { active: false },
        { active: false },
        { active: false },
        { active: false },
        { active: false },
        { active: false },
        { active: false },
        { active: false, selected: true },
        { active: false },
        { active: false, selected: true },
        { active: false },
        { active: false },
        { active: false },
        { active: false, selected: true },
        { active: false },
        { active: false },
        { active: false },
        { active: false, selected: true },
        { active: false, selected: true },
        { active: false },
        { active: false, selected: true },
        { active: false, selected: true },
        { active: false },
        { active: false, selected: true }
    ];

    return (
        <>
            <Head>
                <title>Subject | Event | Exam | CBT | Grand Regal School</title>
                <meta name="description" content="Subject Exam | GRS CBT" />
            </Head>
            <form className="flex flex-col items-center justify-start w-screen min-h-screen overflow-hidden">
                <div className="flex items-center justify-end gap-6 w-full bg-white py-3 px-8 sticky left-0 top-0 rounded-b-lg drop-shadow-sm">
                    <div className="hidden md:flex items-center justify-start gap-2 flex-grow text-gray-400 w-full text-sm font-medium">
                        <span className="w-max block truncate">
                            Session
                        </span>
                        <ChevronRightIcon className="w-5 h-5 text-gray-500" />
                        <span className="w-max block truncate">
                            Class
                        </span>
                        <ChevronRightIcon className="w-5 h-5 text-gray-500" />
                        <span className="w-max block truncate">
                            Subject
                        </span>
                        <ChevronRightIcon className="w-5 h-5 text-gray-500" />
                        <span className="text-gray-600">
                            Name
                        </span>
                    </div>
                    <button
                        type="submit"
                        className="flex items-center justify-center gap-2 py-3 px-8 tracking-wider text-xs font-medium bg-indigo-500 hover:bg-indigo-600 text-white rounded-md shadow-sm"
                    >
                        Submit
                    </button>
                </div>
                <div className="flex flex-grow gap-3 items-center justify-center w-full h-full px-16 overflow-y-auto bg-gray-50">
                    <div className="flex flex-col items-start justify-start h-full w-52 py-8">
                        <div className="flex flex-col gap-3 items-start justify-center w-full h-full">
                            <h4 className="text-xl font-bold text-gray-800">
                                Content
                            </h4>
                            <ul className="flex flex-col gap-2 items-start justify-center w-full">
                                {dummy.map(({ selected, active }, i) => (
                                    <li
                                        key={i}
                                        className={classNames("flex gap-3 items-center justify-start w-full py-2 px-3 -ml-3 rounded-md cursor-pointer", {
                                            "bg-indigo-100": active,
                                            "hover:bg-gray-200": !active
                                        })}
                                    >
                                        <span
                                            className={classNames("flex items-center justify-center flex-shrink-0 w-3.5 h-3.5 ring-2 rounded-full relative z-0", {
                                                "bg-indigo-500": selected === true && active === true,
                                                "bg-gray-700": selected === true && active === false,
                                                "text-gray-700 ring-gray-700": active === false,
                                                "text-indigo-500 ring-indigo-500": active
                                            })}
                                        >
                                            {++i !== dummy.length && (
                                                <svg
                                                    fill="none"
                                                    viewBox="0 0 2 10"
                                                    preserveAspectRatio="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="absolute z-[-1] left-1/2 top-full -translate-x-1/2 h-[calc(100%+1rem)]"
                                                >
                                                    <line
                                                        x1="1"
                                                        y1="0"
                                                        x2="1"
                                                        y2="10"
                                                        stroke="currentColor"
                                                        strokeLinecap="round"
                                                        vectorEffect="non-scaling-stroke"
                                                    />
                                                </svg>
                                            )}
                                            {selected === true && (
                                                <CheckIcon className="w-3 h-3 text-white" />
                                            )}
                                        </span>
                                        <span
                                            className={classNames("text-sm text-gray-700", {
                                                "text-indigo-600 font-medium": active,
                                            })}
                                        >
                                            Question {i}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="flex-grow h-full"></div>
                </div>
            </form>
        </>
    );
}

export default WriteExam;
