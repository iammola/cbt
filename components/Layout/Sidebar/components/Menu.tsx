import Link from "next/link";
import { Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { DesktopComputerIcon } from "@heroicons/react/outline";
import { Fragment, FunctionComponent, ReactNode, useState } from "react";

import { classNames } from "utils";
import { CalendarIcon, HomeIcon, FileTextIcon } from "components/Misc/Icons";

import type { MenuProps } from "types";

const Menu: FunctionComponent<MenuProps> = ({ open }) => {
    return (
        <nav
            className={classNames("grow w-full", {
                "px-5": open === true,
                "px-1 sm:px-4": open === false,
            })}
        >
            <span
                className={classNames("w-full inline-block text-gray-400 text-[0.6rem] font-semibold uppercase tracking-wider pb-4", {
                    "text-center": open === false
                })}
            >
                Menu
            </span>
            <ul className="flex flex-col gap-y-2 items-center justify-center w-full">
                <MenuItem>
                    <MenuItem.Main>
                        <Link href="/home">
                            <a
                                className={classNames("flex gap-2.5 items-center w-full rounded-lg text-gray-600 hover:text-gray-800 hover:bg-gray-100 cursor-pointer py-2.5", {
                                    "justify-start pr-3": open === true,
                                    "justify-center sm:py-3": open === false,
                                })}
                            >
                                <HomeIcon
                                    className={classNames("shrink-0 w-6 h-6", {
                                        "ml-3": open === true
                                    })}
                                />
                                <span
                                    className={classNames("text-sm truncate", {
                                        "hidden": open === false,
                                        "block": open === true
                                    })}
                                >
                                    Dashboard
                                </span>
                            </a>
                        </Link>
                    </MenuItem.Main>
                </MenuItem>
                <MenuItem>
                    {({ expand, toggleExpand }) => (
                        <>
                            <MenuItem.Main>
                                <div
                                    onClick={toggleExpand}
                                    className={classNames("flex gap-2.5 items-center w-full rounded-lg text-gray-600 hover:text-gray-800 hover:bg-gray-100 cursor-pointer py-2.5", {
                                        "justify-start pr-3": open === true,
                                        "justify-center": open === false,
                                    })}
                                >
                                    <FileTextIcon
                                        className={classNames("shrink-0 w-6 h-6", {
                                            "ml-3": open === true
                                        })}
                                    />
                                    <span
                                        className={classNames("text-sm truncate", {
                                            "hidden": open === false,
                                            "block": open === true
                                        })}
                                    >
                                        Exams
                                    </span>
                                    <ChevronDownIcon
                                        className={classNames("shrink-0 w-5 h-5 ml-auto text-gray-600", {
                                            "hidden": open === false
                                        })}
                                    />
                                </div>
                            </MenuItem.Main>
                            {open === true ? (
                                <MenuItem.List expand={expand}>
                                    <li className="w-full">
                                        <Link href="/exams/create/">
                                            <a className="flex gap-2.5 items-center justify-start w-full rounded-lg text-gray-600 hover:text-gray-800 hover:bg-gray-100 py-2.5 pr-3 pl-3 mt-2 cursor-pointer">
                                                <span className="text-sm block truncate">
                                                    Create an Exam
                                                </span>
                                            </a>
                                        </Link>
                                    </li>
                                    <li className="w-full">
                                        <Link href="/exams/">
                                            <a className="flex gap-2.5 items-center justify-start w-full rounded-lg text-gray-600 hover:text-gray-800 hover:bg-gray-100 py-2.5 pr-3 pl-3 mt-2 cursor-pointer">
                                                <span className="text-sm block truncate">
                                                    View Exams
                                                </span>
                                            </a>
                                        </Link>
                                    </li>
                                </MenuItem.List>
                            ) : (
                                <MenuItem.Panel expand={expand}>
                                    <li className="w-full">
                                        <Link href="/exams/create/">
                                            <a className="flex gap-2.5 items-center justify-start w-full rounded-lg text-gray-600 hover:text-gray-800 hover:bg-gray-100 py-2.5 pr-3 pl-3 mt-2 cursor-pointer">
                                                <span className="text-sm block truncate">
                                                    Create an Exam
                                                </span>
                                            </a>
                                        </Link>
                                    </li>
                                    <li className="w-full">
                                        <Link href="/exams">
                                            <a className="flex gap-2.5 items-center justify-start w-full rounded-lg text-gray-600 hover:text-gray-800 hover:bg-gray-100 py-2.5 pr-3 pl-3 mt-2 cursor-pointer">
                                                <span className="text-sm block truncate">
                                                    View Exams
                                                </span>
                                            </a>
                                        </Link>
                                    </li>
                                </MenuItem.Panel>
                            )}

                        </>
                    )}
                </MenuItem>
                <MenuItem>
                    {({ expand, toggleExpand }) => (
                        <>
                            <MenuItem.Main>
                                <div
                                    onClick={toggleExpand}
                                    className={classNames("flex gap-2.5 items-center w-full rounded-lg text-gray-600 hover:text-gray-800 hover:bg-gray-100 cursor-pointer py-2.5", {
                                        "justify-start pr-3": open === true,
                                        "justify-center": open === false,
                                    })}
                                >
                                    <DesktopComputerIcon
                                        className={classNames("shrink-0 w-6 h-6", {
                                            "ml-3": open === true
                                        })}
                                    />
                                    <span
                                        className={classNames("text-sm truncate", {
                                            "hidden": open === false,
                                            "block": open === true
                                        })}
                                    >
                                        Results
                                    </span>
                                    <ChevronDownIcon
                                        className={classNames("shrink-0 w-5 h-5 ml-auto text-gray-600", {
                                            "hidden": open === false
                                        })}
                                    />
                                </div>
                            </MenuItem.Main>
                            {open === true ? (
                                <MenuItem.List expand={expand}>
                                    <li className="w-full">
                                        <Link href="/results/">
                                            <a className="flex gap-2.5 items-center justify-start w-full rounded-lg text-gray-600 hover:text-gray-800 hover:bg-gray-100 py-2.5 pr-3 pl-3 mt-2 cursor-pointer">
                                                <span className="text-sm block truncate">
                                                    View CBT Results
                                                </span>
                                            </a>
                                        </Link>
                                    </li>
                                </MenuItem.List>
                            ) : (
                                <MenuItem.Panel expand={expand}>
                                    <li className="w-full">
                                        <Link href="/results/">
                                            <a className="flex gap-2.5 items-center justify-start w-full rounded-lg text-gray-600 hover:text-gray-800 hover:bg-gray-100 py-2.5 pr-3 pl-3 mt-2 cursor-pointer">
                                                <span className="text-sm block truncate">
                                                    View CBT Results
                                                </span>
                                            </a>
                                        </Link>
                                    </li>
                                </MenuItem.Panel>
                            )}

                        </>
                    )}
                </MenuItem>
                <MenuItem>
                    <MenuItem.Main>
                        <Link href="/calendar">
                            <a
                                className={classNames("flex gap-2.5 items-center w-full rounded-lg text-gray-600 hover:text-gray-800 hover:bg-gray-100 cursor-pointer py-2.5", {
                                    "justify-start pr-3": open === true,
                                    "justify-center sm:py-3": open === false,
                                })}
                            >
                                <CalendarIcon
                                    className={classNames("shrink-0 w-6 h-6", {
                                        "ml-3": open === true
                                    })}
                                />
                                <span
                                    className={classNames("text-sm truncate", {
                                        "hidden": open === false,
                                        "block": open === true
                                    })}
                                >
                                    Calendar
                                </span>
                            </a>
                        </Link>
                    </MenuItem.Main>
                </MenuItem>
            </ul>
        </nav>
    );
}

const MenuItem: MenuItem = ({ children }) => {
    const [expand, setExpand] = useState(false);
    const toggleExpand = () => setExpand(!expand);

    return (
        <li className="w-full">
            {typeof children === 'function' ? children({ expand, toggleExpand }) : children}
        </li>
    );
}

MenuItem.Main = function Main({ children }) {
    return (
        <>
            {children}
        </>
    )
}

MenuItem.List = function List({ expand, children }) {
    return (
        <Transition
            appear
            show={expand}
            as={Fragment}
            enter="ease-out transition-transform origin-top"
            enterFrom="scale-y-0"
            enterTo="scale-y-100"
            leave="ease-in transition-transform origin-top"
            leaveFrom="scale-y-100"
            leaveTo="scale-y-0"
        >
            <ul className="flex flex-col gap-y-2 relative pl-9 overflow-y-hidden">
                {children}
                <div className="absolute inset-0 left-6 w-px bg-gray-200 h-full"></div>
            </ul>
        </Transition>
    )
}

MenuItem.Panel = function Panel({ expand, children }) {
    return (
        <Transition
            appear
            show={expand}
            as={Fragment}
            enter="ease-out transition origin-top-left"
            enterFrom="scale-0 opacity-0"
            enterTo="scale-100 opacity-100"
            leave="ease-in transition origin-top-left"
            leaveFrom="scale-100 opacity-100"
            leaveTo="scale-0 opacity-0"
        >
            <ul className="bg-white w-60 absolute left-10 pl-10 pr-4 py-5 rounded-lg shadow-lg">
                <div className="flex flex-col gap-y-2 relative w-full">
                    {children}
                    <div className="absolute inset-0 -left-3 w-px bg-gray-200 h-full"></div>
                </div>
            </ul>
        </Transition>
    )
}

type RenderChildren = (o: { expand: boolean; toggleExpand(): void }) => ReactNode;

interface MenuItem extends FunctionComponent<{ children: RenderChildren | ReturnType<RenderChildren> }> {
    List: FunctionComponent<Pick<Parameters<RenderChildren>[0], 'expand'>>;
    Panel: FunctionComponent<Pick<Parameters<RenderChildren>[0], 'expand'>>;
    Main: FunctionComponent;
}

export default Menu;
