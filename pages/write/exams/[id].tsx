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
                            <span className="inline-block text-xs font-medium text-gray-500 mt-6">
                                2 out of 17 answered
                            </span>
                        </div>
                    </div>
                    <div className="flex-grow h-full py-8">
                        <div className="m-auto max-w-4xl h-full space-y-5">
                            {Array.from({ length: 17 }).fill(undefined).map((k, i) => (
                                <div key={i} className="w-full pt-8 pb-3 pr-7 pl-4 bg-white rounded-xl shadow-sm">
                                    <p className="w-full rounded-t py-3 pl-4 pr-10 text-gray-700 font-medium text-sm">
                                        Question {++i}
                                    </p>
                                    <ul className="flex flex-col items-start justify-start gap-3 w-full my-5 pl-4">
                                        {[{
                                            id: 'ID',
                                            answered: true,
                                            answer: "Option 1"
                                        }, {
                                            id: "ID2",
                                            answer: "Option 2"
                                        }, {
                                            id: "ID3",
                                            answer: "Option 3"
                                        }, {
                                            id: "4",
                                            answer: "Option 4"
                                        }].map(({ answer, id, answered }) => (
                                            <li
                                                key={id}
                                                className="flex items-center justify-start gap-4 w-full -ml-5 pl-5 rounded-md hover:bg-gray-50"
                                            >
                                                <input
                                                    id={id}
                                                    value={id}
                                                    type="checkbox"
                                                    className="hidden"
                                                    // readOnly
                                                    // checked={answered ?? false}
                                                    // onChange={({ target: { checked } }) => alert(checked)}
                                                />
                                                <label
                                                    htmlFor={id}
                                                    className={classNames("w-3 h-3 rounded-full text-xs flex-shrink-0 ring-2 ring-offset-4 ring-gray-400 ring-offset-white cursor-pointer", {
                                                        "bg-gray-400": answered,
                                                        "bg-white": !answered
                                                    })}
                                                />
                                                <label htmlFor={id}>
                                                    <p className="w-full rounded-t py-3 pl-4 pr-10 text-gray-700 font-medium text-sm">
                                                        {answer}
                                                    </p>
                                                </label>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="fixed right-6 top-20 py-3 px-4 rounded-md shadow-md bg-white text-sm font-medium text-gray-700">
                    29:30 minutes left
                </div>
            </form>
        </>
    );
}

export default WriteExam;
