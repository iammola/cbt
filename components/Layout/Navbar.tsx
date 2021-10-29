import Link from "next/link";
import { useRouter } from "next/router";
import { useCookies } from "react-cookie";
import { LogoutIcon } from "@heroicons/react/outline";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { FunctionComponent, useEffect, useState } from "react";

import { classNames } from "utils";
import UserImage from "components/Misc/UserImage";

const Navbar: FunctionComponent = () => {
    const router = useRouter();
    const [online, setOnline] = useState(false);
    const [{ account }, , removeCookies] = useCookies(['account']);

    useEffect(() => {
        const toggleOnline = () => setOnline(navigator.onLine);

        toggleOnline();
        window.addEventListener('online', toggleOnline);
        window.addEventListener('offline', toggleOnline);

        return () => {
            window.removeEventListener('online', toggleOnline);
            window.removeEventListener('offline', toggleOnline);
        }
    }, []);

    function logout() {
        removeCookies('account');
        router.push('/');
    }

    return (
        <header className="flex gap-4 items-center justify-between w-full h-[4.5rem] px-6">
            <div className="flex items-center justify-center text-lg font-bold text-gray-800 tracking-wide h-full">
                Grand Regal School
            </div>
            <nav className="h-full">
                <ul className="flex items-center justify-center gap-5 flex-grow h-full">
                    <li className="relative h-full cursor-pointer">
                        <Link href="/home">
                            <a className="flex items-center justify-center text-sm tracking-wider px-7 h-full drop-shadow-xl text-blue-700">
                                Home
                            </a>
                        </Link>
                        <span className="w-full h-[0.165rem] absolute top-0 inset-x-0 bg-blue-700 rounded-full drop-shadow-xl" />
                    </li>
                    {account?.access === "Student" ? (
                        <>
                            <li className="relative h-full cursor-pointer">
                                <Link href="/exams">
                                    <a className="flex items-center justify-center text-sm tracking-wider px-7 h-full text-gray-400">
                                        Exams
                                    </a>
                                </Link>
                            </li>
                            <li className="relative h-full cursor-pointer">
                                <Link href="/results">
                                    <a className="flex items-center justify-center text-sm tracking-wider px-7 h-full text-gray-400">
                                        Results
                                    </a>
                                </Link>
                            </li>
                        </>
                    ) : (account?.access === "Teacher") && (
                        <>
                            <li className="relative h-full cursor-pointer">
                                <Link href="/create/exam">
                                    <a className="flex items-center justify-center text-sm tracking-wider px-7 h-full text-gray-400">
                                        Create an Exam
                                    </a>
                                </Link>
                            </li>
                        </>
                    )}
                    <li className="relative h-full cursor-pointer">
                        <Link href="/schedule">
                            <a className="flex items-center justify-center text-sm tracking-wider px-7 h-full text-gray-400">
                                Schedule
                            </a>
                        </Link>
                    </li>
                </ul>
            </nav>
            {account !== undefined && (
                <div className="flex flex-shrink-0 items-center gap-5 p-3 cursor-pointer rounded-lg transition-colors hover:bg-gray-100">
                    <div className="flex items-center justify-center relative rounded-full bg-blue-500 flex-shrink-0 w-10 h-10">
                        <UserImage
                            image=""
                            className="rounded-full"
                            placeholder={account.name.initials}
                        />
                        <span className="flex absolute bottom-0.5 right-0.5 h-2.5 w-2.5 -mt-1 -mr-1">
                            <span className="absolute h-full w-full rounded-full ring ring-white" />
                            <span className={classNames("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", {
                                "bg-green-500": online,
                                "bg-red-500": !online
                            })} />
                            <span className={classNames("relative inline-flex rounded-full h-full w-full", {
                                "bg-green-600": online,
                                "bg-red-600": !online
                            })} />
                        </span>
                    </div>
                    <div className="flex flex-grow justify-center flex-col h-full">
                        <span className="text-gray-500 text-sm font-medium block truncate">
                            {account.name.title} {account.name.fullName}
                        </span>
                        <span className="text-gray-700 text-[.65rem] tracking-widest block truncate">
                            {account.access}
                        </span>
                    </div>
                    <button className="flex items-center justify-center h-full ml-3 p-[0.1rem] rounded-md relative group hover:bg-gray-200 focus:outline-none focus:bg-gray-200">
                        <ChevronDownIcon className="w-5 h-5 flex-shrink-0 text-gray-600" />
                        <div className="hidden group-focus:block absolute -bottom-14 -right-2 z-10 py-2 w-40 rounded-md shadow-xl bg-white overflow-hidden">
                            <span
                                onClick={logout}
                                className="flex gap-3 py-2 px-5 text-sm min-w-max w-full text-gray-600 hover:bg-gray-200"
                            >
                                <LogoutIcon className="w-5 h-5" />
                                Log out
                            </span>
                        </div>
                    </button>
                </div>
            )}
        </header>
    )
}

export default Navbar;
