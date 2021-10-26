import { useCookies } from "react-cookie";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { FunctionComponent, useEffect, useState } from "react";

import { classNames } from "utils";
import UserImage from "components/UserImage";

const Navbar: FunctionComponent = () => {
    const [online, setOnline] = useState(false);
    const [{ account }] = useCookies(['account']);

    useEffect(() => {
        const toggleOnline = () => setOnline(navigator.onLine);

        window.addEventListener('online', toggleOnline);
        window.addEventListener('offline', toggleOnline);

        return () => {
            window.removeEventListener('online', toggleOnline);
            window.removeEventListener('offline', toggleOnline);
        }
    }, []);

    return (
        <header className="flex gap-4 items-center justify-between w-full h-[4.5rem] px-6">
            <div className="flex items-center justify-center text-lg font-bold text-gray-800 tracking-wide h-full">
                Grand Regal School
            </div>
            <ul className="flex items-center justify-center gap-5 flex-grow h-full">
                <li className="flex items-center justify-center relative h-full w-max px-7 cursor-pointer">
                    <a className="text-sm tracking-wider drop-shadow-xl text-blue-700">
                        Home
                    </a>
                    <span className="w-full h-[0.165rem] absolute top-0 inset-x-0 bg-blue-700 rounded-full drop-shadow-xl" />
                </li>
                <li className="flex items-center justify-center relative h-full w-max px-7 cursor-pointer">
                    <a className="text-sm tracking-wider text-gray-400">
                        Exams
                    </a>
                </li>
                <li className="flex items-center justify-center relative h-full w-max px-7 cursor-pointer">
                    <a className="text-sm tracking-wider text-gray-400">
                        Results
                    </a>
                </li>
                <li className="flex items-center justify-center relative h-full w-max px-7 cursor-pointer">
                    <a className="text-sm tracking-wider text-gray-400">
                        Schedule
                    </a>
                </li>
            </ul>
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
                    <div className="flex items-center justify-center h-full pl-3">
                        <ChevronDownIcon className="w-5 h-5 flex-shrink-0 text-gray-600" />
                    </div>
                </div>
            )}
        </header>
    )
}

export default Navbar;
