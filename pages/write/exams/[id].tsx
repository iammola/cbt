import Head from "next/head";
import { NextPage } from "next";

import { classNames } from "utils";

const WriteExam: NextPage = () => {
    return (
        <>
            <Head>
                <title>Subject | Event | Exam | CBT | Grand Regal School</title>
                <meta name="description" content="Subject Exam | GRS CBT" />
                <style>{`
                    #main,
                    body { overflow: unset !important; }
                `}</style>
            </Head>
            <form className="flex flex-col items-center justify-start w-screen min-h-screen">
                <div className="flex items-center justify-end gap-6 w-full bg-white py-3 px-8 rounded-b-lg drop-shadow-sm">
                    <div className="hidden md:flex items-center justify-start gap-2 flex-grow text-gray-400 w-full text-sm font-medium">
                        <span className="w-max block truncate">
                            Session
                        </span>
                        {' • '}
                        <span className="w-max block truncate">
                            Class
                        </span>
                        {' • '}
                        <span className="w-max block truncate">
                            Subject
                        </span>
                        {' • '}
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
                <div className="flex flex-grow gap-6 items-center justify-center w-full h-full pt-6 px-12 bg-gray-50">
                    <div className="flex flex-col items-start justify-start h-full w-[18rem] py-8">
                        <div className="w-full bg-white rounded-xl shadow-sm py-8 px-5 ring-1 ring-gray-200 sticky top-14">
                            <ul className="grid grid-cols-5 gap-4 items-start justify-center w-full">
                                {[{
                                    answered: true,
                                    active: false,
                                }, {
                                    answered: true,
                                    active: true,
                                }, ...new Array(15).fill(undefined)].map(({ answered, active } = {}, i) => (
                                    <li
                                        key={i}
                                        style={{ aspectRatio: '1' }}
                                        className={classNames("flex items-center justify-center rounded-md shadow-sm cursor-pointer text-sm font-semibold tracking-wider ring-1 ring-gray-100 relative group", {
                                            "bg-white hover:bg-gray-50 text-gray-700": !answered,
                                            "bg-gray-500 hover:bg-gray-600 text-gray-200": active,
                                        })}
                                    >
                                        {++i}
                                        {answered === true && (
                                            <span
                                                aria-label={`Question ${i} answered`}
                                                className={classNames("absolute top-1.5 right-1.5 rounded-full w-1 h-1", {
                                                    "bg-gray-200": active,
                                                    "bg-gray-700": !active
                                                })}
                                            />
                                        )}
                                        <span className="hidden group-hover:inline absolute left-1/2 -top-9 -translate-x-1/2 p-2 rounded-md shadow-md text-xs font-normal text-gray-600 bg-white w-max">
                                            Go to Question {i}
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
