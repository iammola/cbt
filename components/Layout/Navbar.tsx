import Link from "next/link";
import { useRouter } from "next/router";
import { useCookies } from "react-cookie";
import { Transition } from "@headlessui/react";
import { LogoutIcon } from "@heroicons/react/outline";
import { ChevronDownIcon, MenuIcon } from "@heroicons/react/solid";
import { Fragment, FunctionComponent, useEffect, useState } from "react";

import { classNames } from "utils";
import UserImage from "components/Misc/UserImage";

const Navbar: FunctionComponent = () => {
    const router = useRouter();
    const [showNav, setShowNav] = useState(false);
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
        <header className="flex gap-4 items-center justify-between w-full h-[4.5rem] px-6 relative">
            <div className="flex sm:hidden xl:flex items-center justify-center text-lg font-bold text-gray-800 tracking-wide h-full">
                Grand Regal School
            </div>
            <nav className="h-full hidden sm:block">
                <ul className="flex items-center justify-center gap-10 flex-grow h-full">
                    <li className="relative h-full cursor-pointer">
                        <Link href="/home">
                            <a className="flex items-center justify-center text-sm font-medium tracking-widest px-1.5 h-full w-max text-gray-800">
                                Home
                            </a>
                        </Link>
                        <span className="w-full h-0.5 absolute -bottom-0.5 inset-x-0 bg-indigo-700" />
                    </li>
                    {account?.access === "Student" ? (
                        <>
                            <li className="relative h-full cursor-pointer">
                                <Link href="/exams">
                                    <a className="flex items-center justify-center text-sm font-medium tracking-widest px-1.5 h-full w-max text-gray-500">
                                        Exams
                                    </a>
                                </Link>
                            </li>
                            <li className="relative h-full cursor-pointer">
                                <Link href="/results">
                                    <a className="flex items-center justify-center text-sm font-medium tracking-widest px-1.5 h-full w-max text-gray-500">
                                        Results
                                    </a>
                                </Link>
                            </li>
                        </>
                    ) : (account?.access === "Teacher") && (
                        <>
                            <li className="relative h-full cursor-pointer">
                                <Link href="/create/exam">
                                    <a className="flex items-center justify-center text-sm font-medium tracking-widest px-1.5 h-full w-max transition-colors text-gray-500 hover:text-gray-800">
                                        Create an Exam
                                    </a>
                                </Link>
                            </li>
                        </>
                    )}
                    <li className="relative h-full cursor-pointer">
                        <Link href="/schedule">
                            <a className="flex items-center justify-center text-sm font-medium tracking-widest px-1.5 h-full w-max text-gray-500">
                                Schedule
                            </a>
                        </Link>
                    </li>
                </ul>
            </nav>
            <div className="flex sm:hidden items-center justify-center self-end h-full cursor-pointer">
                <div
                    onClick={() => setShowNav(!showNav)}
                    className="p-1 rounded-md hover:bg-gray-100"
                >
                    <MenuIcon className="w-5 h-5 text-gray-700" />
                </div>
            </div>
            <Transition
                appear
                show={showNav}
                as={Fragment}
                enter="transition origin-top-right ease-out"
                enterFrom="opacity-0 scale-0"
                enterTo="opacity-100 scale-100"
                leave="transition origin-top-right ease-in"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-0"
            >
                <div className="block sm:hidden w-full px-4 pt-3 absolute right-0 top-16 z-50">
                    <div className="flex flex-col items-center justify-center gap-3 w-full h-full bg-white rounded-lg shadow-lg py-5 px-4 divide-y divide-gray-200">
                        <nav className="w-full">
                            <ul className="flex flex-col gap-2">
                                <li className="pl-3 pr-5 py-3 rounded-lg text-gray-700 hover:bg-gray-50">
                                    <Link href="/">
                                        <a className="flex items-center text-sm font-medium tracking-widest">
                                            Home
                                        </a>
                                    </Link>
                                </li>
                                {account?.access === "Student" ? (
                                    <>
                                        <li className="pl-3 pr-5 py-3 rounded-lg text-gray-700 hover:bg-gray-50">
                                            <Link href="/exams">
                                                <a className="flex items-center text-sm font-medium tracking-widest">
                                                    Exams
                                                </a>
                                            </Link>
                                        </li>
                                        <li className="pl-3 pr-5 py-3 rounded-lg text-gray-700 hover:bg-gray-50">
                                            <Link href="/results">
                                                <a className="flex items-center text-sm font-medium tracking-widest">
                                                    Results
                                                </a>
                                            </Link>
                                        </li>
                                    </>
                                ) : (account?.access === "Teacher") && (
                                    <>
                                        <li className="pl-3 pr-5 py-3 rounded-lg text-gray-700 hover:bg-gray-50">
                                            <Link href="/create/exam">
                                                <a className="flex items-center text-sm font-medium tracking-widest">
                                                    Create an Exam
                                                </a>
                                            </Link>
                                        </li>
                                    </>
                                )}
                                <li className="pl-3 pr-5 py-3 rounded-lg text-gray-700 hover:bg-gray-50">
                                    <Link href="/">
                                        <a className="flex items-center text-sm font-medium tracking-widest">
                                            Schedule
                                        </a>
                                    </Link>
                                </li>
                            </ul>
                        </nav>
                        <div className="flex flex-col gap-6 pt-4 w-full">
                            {account !== undefined && (
                                <div className="flex flex-shrink-0 items-center gap-7 cursor-pointer">
                                    <div className="flex items-center justify-center relative rounded-full bg-indigo-500 flex-shrink-0 w-10 h-10">
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
                                    <span className="text-gray-700 font-semibold block truncate">
                                        {account.name.title} {account.name.fullName}
                                    </span>
                                </div>
                            )}
                            <button
                                onClick={logout}
                                className="flex gap-3 items-center justify-center w-full py-2 px-4 rounded-lg text-white bg-blue-500 hover:bg-blue-600"
                            >
                                <LogoutIcon className="w-5 h-5" />
                                Log out
                            </button>
                        </div>
                    </div>
                </div>
            </Transition>
            {account !== undefined && (
                <div className="hidden sm:flex flex-shrink-0 items-center gap-1 lg:gap-5 my-4 p-3 cursor-pointer rounded-lg transition-colors hover:bg-gray-100">
                    <div className="flex items-center justify-center relative rounded-full bg-indigo-500 flex-shrink-0 w-10 h-10">
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
                    <div className="hidden md:flex flex-grow justify-center flex-col h-full">
                        <span className="text-gray-800 text-sm font-medium block truncate">
                            {account.name.title} {account.name.fullName}
                        </span>
                        <span className="text-gray-500 text-xs tracking-widest block truncate">
                            {account.access}
                        </span>
                    </div>
                    <button className="flex items-center justify-center h-full ml-3 p-[0.1rem] rounded-md relative group hover:bg-gray-200 focus:outline-none focus:bg-gray-200">
                        <ChevronDownIcon className="w-5 h-5 flex-shrink-0 text-gray-600" />
                        <div className="hidden group-focus:block absolute -bottom-14 -right-2 z-10 py-2 w-40 rounded-md shadow-xl bg-white overflow-hidden">
                            <span
                                onClick={logout}
                                className="flex gap-3 py-2 pl-4 pr-1.5 text-sm min-w-max w-full text-gray-600 hover:bg-gray-200"
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
