import Head from "next/head";
import { NextPage } from "next";

const WriteExam: NextPage = () => {
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
            </form>
        </>
    );
}

export default WriteExam;
